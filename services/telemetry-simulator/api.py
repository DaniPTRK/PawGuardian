"""
Wrapper that includes the simulator in a FastAPI server
so the frontend can start/stop/control it.
"""

import threading
import time
import requests as http
import logging

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from simulator import PetSimulator, fetch_token, fetch_pet_species

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title='PawGuardian Telemetry Simulator API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)

# Sim state
_lock = threading.Lock()
_simulators = {}
_running = False
_thread = None
_config = {}
_latest_readings = {}

# Request / Response models
class StartRequest(BaseModel):
    backend_url: str = 'http://backend:8091'
    pet_ids: list[int]
    interval: int = 30
    base_lat: float = 44.4
    base_lng: float = 26.1
    wander_radius: float = 0.005
    initial_battery: int = 100
    initial_heart_rate: float | None = None
    initial_temperature: float | None = None
    email: str | None = None
    password: str | None = None

class AddPetRequest(BaseModel):
    pet_id: int
    base_lat: float | None = None
    base_lng: float | None = None
    initial_battery: int = 100
    initial_heart_rate: float | None = None
    initial_temperature: float | None = None
    species: str | None = None

class RemovePetRequest(BaseModel):
    pet_id: int

# Simulation loop
def simulation_loop():
    global _running, _latest_readings

    backend_url = _config['backend_url']
    interval = _config['interval']
    record_endpoint = f'{backend_url}/api/v1/telemetry/record'

    logger.info(f'Simulation loop started. Interval: {interval}s')

    while _running:
        with _lock:
            current_sims = dict(_simulators)

        for pid, sim in current_sims.items():
            reading = sim.generate_reading()

            with _lock:
                _latest_readings[pid] = reading

            try:
                resp = http.post(record_endpoint, json=reading, timeout=10)
                if resp.status_code in (200, 201):
                    logger.info(
                        f'Pet {pid}: HR={reading["heartRate"]} '
                        f'T={reading["temperature"]}°C '
                        f'Bat={reading["batteryLevel"]}% '
                        f'({reading["latitude"]:.5f}, {reading["longitude"]:.5f})'
                    )
                else:
                    logger.warning(f'Pet {pid}: HTTP {resp.status_code} — {resp.text[:200]}')
            except http.RequestException as e:
                logger.error(f'Pet {pid}: Failed to send — {e}')

        time.sleep(interval)

    logger.info('Simulation loop stopped.')


# Endpoints

# This endpoint starts the simulation
@app.post('/start')
def start(req: StartRequest):
    global _running, _thread, _config, _simulators, _latest_readings

    if _running:
        raise HTTPException(status_code=409, detail='Simulation is already running. Stop it first.')

    # Fetch species from backend
    token = None
    if req.email and req.password:
        token = fetch_token(req.backend_url, req.email, req.password)

    with _lock:
        _simulators = {}
        _latest_readings = {}
        _config = req.model_dump() # get req body

        for pid in req.pet_ids:
            species = fetch_pet_species(req.backend_url, pid, token) if token else None
            _simulators[pid] = PetSimulator(
                pet_id=pid,
                base_lat=req.base_lat,
                base_lng=req.base_lng,
                wander_radius=req.wander_radius,
                initial_battery=req.initial_battery,
                species=species,
                initial_heart_rate=req.initial_heart_rate,
                initial_temperature=req.initial_temperature,
            )

    _running = True
    _thread = threading.Thread(target=simulation_loop, daemon=True)
    _thread.start()

    return {'status': 'started', 'pet_ids': req.pet_ids, 'interval': req.interval}

# Endpoint to stop the simulation
@app.post('/stop')
def stop():
    global _running

    if not _running:
        raise HTTPException(status_code=409, detail='Simulation is not running.')

    _running = False
    return {'status': 'stopped'}

# Get status
@app.get('/status')
def status():
    with _lock:
        readings = dict(_latest_readings)
        pet_ids = list(_simulators.keys())

    return {
        'running': _running,
        'interval': _config.get('interval'),
        'pet_ids': pet_ids,
        'readings': readings,
    }

# Add pet to a current simulation
@app.post('/pets/add')
def add_pet(req: AddPetRequest):
    if not _running:
        raise HTTPException(status_code=409, detail='Simulation is not running. Start it first.')

    with _lock:
        if req.pet_id in _simulators:
            raise HTTPException(status_code=409, detail=f'Pet {req.pet_id} is already in the simulation.')

        _simulators[req.pet_id] = PetSimulator(
            pet_id=req.pet_id,
            base_lat=req.base_lat if req.base_lat is not None else _config.get('base_lat', 44.4),
            base_lng=req.base_lng if req.base_lng is not None else _config.get('base_lng', 26.1),
            wander_radius=_config.get('wander_radius', 0.005),
            initial_battery=req.initial_battery,
            species=req.species,
            initial_heart_rate=req.initial_heart_rate,
            initial_temperature=req.initial_temperature,
        )

    return {'status': 'added', 'pet_id': req.pet_id}

# Remove a pet from the simulation
@app.post('/pets/remove')
def remove_pet(req: RemovePetRequest):
    with _lock:
        if req.pet_id not in _simulators:
            raise HTTPException(status_code=404, detail=f'Pet {req.pet_id} not found in simulation.')
        del _simulators[req.pet_id]
        _latest_readings.pop(req.pet_id, None)

    return {'status': 'removed', 'pet_id': req.pet_id}


@app.post('/recharge/{pet_id}', summary='Recharge a pet\'s battery to 100%')
def recharge(pet_id: int, level: int = 100):
    with _lock:
        if pet_id not in _simulators:
            raise HTTPException(status_code=404, detail=f'Pet {pet_id} not found in simulation.')
        _simulators[pet_id].recharge_battery(level)

    return {'status': 'recharged', 'pet_id': pet_id, 'battery': level}

