"""
Simulator that generates fake telemetry data
"""

import time
import random
import math
import requests
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Heart rate ranges by species
SPECIES_HEART_RATE = {
    'dog':    (60,  140),
    'cat':    (120, 180),
    'rabbit': (120, 150),
    'bird':   (200, 400),
    'other': (60, 120),
}
DEFAULT_HEART_RATE = (60, 120)

# Normal body temperature by species
SPECIES_TEMPERATURE = {
    'dog':    (37.5, 39.2),
    'cat':    (38.0, 39.2),
    'rabbit': (38.5, 40.0),
    'bird':   (40.0, 42.0),
    'other': (37.5, 39.5),
}
DEFAULT_TEMPERATURE = (37.5, 39.5)


def fetch_token(backend_url, email, password):
    # Login and return a JWT token
    try:
        resp = requests.post(
            f'{backend_url}/api/v1/auth/login',
            json={'email': email, 'password': password},
            timeout=10
        )
        if resp.status_code == 200:
            token = resp.json().get('token')
            logger.info('Authenticated successfully.')
            return token
        else:
            logger.warning(f'Login failed with status code {resp.status_code} {resp.text[:200]}')
    except requests.RequestException as e:
        logger.error(f'Login request failed: {e}')
    return None


def fetch_pet_species(backend_url, pet_id, token):
    # Fetch a pet's species from the backend
    try:
        resp = requests.get(
            f'{backend_url}/api/v1/pets/{pet_id}',
            headers={'Authorization': f'Bearer {token}'},
            timeout=10
        )
        if resp.status_code == 200:
            species = resp.json().get('species', '').lower()
            logger.info(f'Pet {pet_id} species: {species}')
            return species
        else:
            logger.warning(f'Could not fetch pet {pet_id}: HTTP {resp.status_code}')
    except requests.RequestException as e:
        logger.error(f'Failed to fetch pet {pet_id}: {e}')
    return None


def heart_rate_for_species(species):
    # Return heart rate for species
    mini, maxi = SPECIES_HEART_RATE.get(species or '', DEFAULT_HEART_RATE)
    return random.uniform(mini, maxi)

def temperature_for_species(species):
    # Return body temp for species
    mini, maxi = SPECIES_TEMPERATURE.get(species or '', DEFAULT_TEMPERATURE)
    return round(random.uniform(mini, maxi), 1)


class PetSimulator:
    # Simulates a pet's telemetry data

    def __init__(self, pet_id, base_lat, base_lng, wander_radius = 0.005,
                 initial_battery = 100, species = None,
                 initial_heart_rate = None, initial_temperature = None):
        self.pet_id = pet_id
        self.lat = base_lat + random.uniform(-wander_radius, wander_radius)
        self.lng = base_lng + random.uniform(-wander_radius, wander_radius)
        self.base_lat = base_lat
        self.base_lng = base_lng
        self.wander_radius = wander_radius
        self.battery = initial_battery
        # Use provided values or derive from species
        self.base_heart_rate = initial_heart_rate if initial_heart_rate is not None else heart_rate_for_species(species)
        self.base_temperature = initial_temperature if initial_temperature is not None else temperature_for_species(species)
        self.angle = random.uniform(0, 2 * math.pi)
        logger.info(f'Pet {pet_id} ({species or "unknown"}): '
                    f'HR={self.base_heart_rate:.1f} bpm, Temp={self.base_temperature}°C')


    def generate_reading(self):
        # Wander in a somewhat realistic pattern
        self.angle += random.uniform(-0.5, 0.5)
        step = random.uniform(0.00001, 0.0003)
        self.lat += math.sin(self.angle) * step
        self.lng += math.cos(self.angle) * step

        # Keep within wander radius
        dist_lat = self.lat - self.base_lat
        dist_lng = self.lng - self.base_lng
        if abs(dist_lat) > self.wander_radius:
            self.lat = self.base_lat + (self.wander_radius * (1 if dist_lat > 0 else -1))
            self.angle += math.pi
        if abs(dist_lng) > self.wander_radius:
            self.lng = self.base_lng + (self.wander_radius * (1 if dist_lng > 0 else -1))
            self.angle += math.pi

        # Heart rate variations
        heart_rate = self.base_heart_rate + random.gauss(0, 5)
        heart_rate = max(50, min(160, heart_rate))

        # Temperature variations
        temperature = self.base_temperature + random.gauss(0, 0.3)
        temperature = round(max(36.5, min(41.0, temperature)), 1)

        # Battery slowly decreases
        self.battery = max(0, self.battery - random.uniform(0.01, 0.3))

        return {
            'petId': self.pet_id,
            'latitude': round(self.lat, 6),
            'longitude': round(self.lng, 6),
            'heartRate': round(heart_rate, 1),
            'temperature': temperature,
            'batteryLevel': int(self.battery),
        }

    def recharge_battery(self, level = 100):
        # Recharge the battery to the given level
        self.battery = min(100, max(0, level))


def run_simulation(backend_url, pet_ids, interval = 30,
                   base_lat = 44.4, base_lng = 26.1,
                   wander_radius = 0.005, initial_battery = 100,
                   email= None, password = None):
    # Run the telemetry simulation loop.
    # The backend URL should be the URL on which the springboot is running inside the cluster.
    record_endpoint = f'{backend_url}/api/v1/telemetry/record'

    if not pet_ids:
        logger.error('No pet IDs provided.')
        return

    # Try to authenticate and fetch species for each pet
    token = None
    if email and password:
        token = fetch_token(backend_url, email, password)

    simulators = {}
    for pid in pet_ids:
        species = fetch_pet_species(backend_url, pid, token) if token else None
        simulators[pid] = PetSimulator(
            pet_id=pid,
            base_lat=base_lat,
            base_lng=base_lng,
            wander_radius=wander_radius,
            initial_battery=initial_battery,
            species=species,
        )

    logger.info(f'Starting telemetry simulator for pets: {pet_ids}')
    logger.info(f'Backend: {backend_url}, Interval: {interval}s')

    while True:
        for pid, sim in simulators.items():
            reading = sim.generate_reading()
            try:
                resp = requests.post(record_endpoint, json=reading, timeout=10)
                if resp.status_code in (200, 201):
                    logger.info(f'Pet {pid}: HR={reading["heartRate"]} T={reading["temperature"]}°C '
                                f'Bat={reading["batteryLevel"]}% '
                                f'({reading["latitude"]}, {reading["longitude"]})')
                else:
                    logger.warning(f'Pet {pid}: HTTP {resp.status_code} {resp.text[:200]}')
            except requests.RequestException as e:
                logger.error(f'Pet {pid}: Failed to send {e}')

        time.sleep(interval)

if __name__ == '__main__':
    # Example usage - this is used locally
    run_simulation(
        backend_url='http://localhost:8091',
        pet_ids=[1, 2, 3, 4],
        email='admin@admin.com',
        password='admin',
    )
