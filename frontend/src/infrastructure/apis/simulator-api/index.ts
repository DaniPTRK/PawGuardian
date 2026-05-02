/**
 * HTTP client for the PawGuardian Telemetry Simulator.
 * The simulator runs as a FastAPI service on port 8091.
 */

const SIMULATOR_URL = 'http://192.168.0.2:8091';

export interface SimulatorStartRequest {
  backend_url?: string;
  pet_ids: number[];
  interval?: number;
  base_lat?: number;
  base_lng?: number;
  wander_radius?: number;
  initial_battery?: number;
  initial_heart_rate?: number | null;
  initial_temperature?: number | null;
  email?: string | null;
  password?: string | null;
}

export interface SimulatorReading {
  petId: number;
  latitude: number;
  longitude: number;
  heartRate: number;
  temperature: number;
  batteryLevel: number;
}

export interface SimulatorStatus {
  running: boolean;
  interval: number | null;
  pet_ids: number[];
  readings: Record<number, SimulatorReading>;
}

export interface AddPetRequest {
  pet_id: number;
  base_lat?: number | null;
  base_lng?: number | null;
  initial_battery?: number;
  initial_heart_rate?: number | null;
  initial_temperature?: number | null;
  species?: string | null;
}

async function post(path: string, body?: unknown) {
  const res = await fetch(`${SIMULATOR_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail ?? `Simulator API error: ${res.status}`);
  }
  return res.json();
}

async function get(path: string) {
  const res = await fetch(`${SIMULATOR_URL}${path}`);
  if (!res.ok) throw new Error(`Simulator API error: ${res.status}`);
  return res.json();
}

export const simulatorApi = {
  start: (req: SimulatorStartRequest) => post('/start', req),
  stop: () => post('/stop'),
  status: (): Promise<SimulatorStatus> => get('/status'),
  addPet: (req: AddPetRequest) => post('/pets/add', req),
  removePet: (petId: number) => post('/pets/remove', { pet_id: petId }),
  recharge: (petId: number, level = 100) =>
    post(`/recharge/${petId}?level=${level}`),
};

