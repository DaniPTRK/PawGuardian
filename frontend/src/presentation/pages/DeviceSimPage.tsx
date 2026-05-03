import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Radio, Play, Square, RotateCcw, BatteryCharging, PawPrint,
  Heart, Thermometer, MapPin, Clock, Zap, Plus, Minus,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { petApi, deviceApi } from '../../infrastructure/apis/api-management';
import { simulatorApi, type SimulatorStatus, type SimulatorReading } from '../../infrastructure/apis/simulator-api';
import type { DeviceResponseDto } from '../../infrastructure/apis/client/models';

const BACKEND_URL = 'http://192.168.0.2:8090';

const DeviceSimPage: React.FC = () => {
  const { data: pets = [] } = useQuery({ queryKey: ['pets'], queryFn: () => petApi.getMyPets() });

  // Get all pets and their associated device
  const deviceQueries = useQuery({
    queryKey: ['pet-devices', pets.map(p => p.id).join(',')],
    queryFn: async () => {
      const results: { petId: number; petName: string; device: DeviceResponseDto | null }[] = [];
      for (const pet of pets) {
        try {
          const device = await deviceApi.getDeviceForPet({ petId: pet.id! });
          results.push({ petId: pet.id!, petName: pet.name ?? `Pet ${pet.id}`, device });
        } catch {
          results.push({ petId: pet.id!, petName: pet.name ?? `Pet ${pet.id}`, device: null });
        }
      }
      return results;
    },
    enabled: pets.length > 0,
  });

  const petsWithDevices = (deviceQueries.data ?? []).filter(p => p.device?.id);
  const petsWithoutDevices = (deviceQueries.data ?? []).filter(p => !p.device?.id);

  // Config
  const [baseLat, setBaseLat] = useState(44.4);
  const [baseLng, setBaseLng] = useState(26.1);
  const [initBattery, setInitBattery] = useState(100);
  const [interval, setIntervalSec] = useState(10);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Live simulator state (from polling /status)
  const [simStatus, setSimStatus] = useState<SimulatorStatus | null>(null);
  const [pollError, setPollError] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }, []);

  const startPolling = useCallback(() => {
    if (pollRef.current) return;
    pollRef.current = setInterval(async () => {
      try {
        const s = await simulatorApi.status();
        setSimStatus(s);
        setPollError(false);
        if (!s.running) stopPolling();
      } catch {
        setPollError(true);
      }
    }, 2000);
  }, [stopPolling]);

  useEffect(() => {
    simulatorApi.status().then(s => {
      setSimStatus(s);
      if (s.running) startPolling();
    }).catch(() => setPollError(true));

    return () => stopPolling();
  }, [startPolling, stopPolling]);

  // Starting the simulator
  const handleStart = async () => {
    if (petsWithDevices.length === 0) {
      toast.error('No pets with registered devices found.');
      return;
    }
    try {
      await simulatorApi.start({
        backend_url: BACKEND_URL,
        pet_ids: petsWithDevices.map(p => p.petId),
        interval,
        base_lat: baseLat,
        base_lng: baseLng,
        initial_battery: initBattery,
        email: email || null,
        password: password || null,
      });
      toast.success('Simulation started!');
      startPolling();
      const s = await simulatorApi.status();
      setSimStatus(s);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to start simulator');
    }
  };

  // Stopping the simulator
  const handleStop = async () => {
    try {
      await simulatorApi.stop();
      stopPolling();
      const s = await simulatorApi.status();
      setSimStatus(s);
      toast.success('Simulation stopped.');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to stop simulator');
    }
  };

  const handleReset = async () => {
    try {
      if (simStatus?.running) await simulatorApi.stop();
      stopPolling();
      setSimStatus(null);
      toast.success('Simulator reset.');
    } catch { /* ignore */ }
  };

  const handleAddPet = async (petId: number) => {
    try {
      await simulatorApi.addPet({ pet_id: petId, base_lat: baseLat, base_lng: baseLng, initial_battery: initBattery });
      toast.success(`Pet ${petId} added to simulation.`);
      const s = await simulatorApi.status();
      setSimStatus(s);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to add pet');
    }
  };

  const handleRemovePet = async (petId: number) => {
    try {
      await simulatorApi.removePet(petId);
      toast.success(`Pet ${petId} removed from simulation.`);
      const s = await simulatorApi.status();
      setSimStatus(s);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to remove pet');
    }
  };

  const handleRecharge = async (petId: number) => {
    try {
      await simulatorApi.recharge(petId);
      toast.success('Battery recharged to 100%!');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to recharge');
    }
  };

  const isRunning = simStatus?.running ?? false;
  const readings: Record<number, SimulatorReading> = simStatus?.readings ?? {};
  const activePetIds = simStatus?.pet_ids ?? [];

  const petNameMap = Object.fromEntries(
    (deviceQueries.data ?? []).map(p => [p.petId, p.petName])
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
          <Radio size={20} className="text-indigo-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Device Simulator [DEV]</h1>
          <p className="text-sm text-gray-400">Controls the telemetry simulator service</p>
        </div>
        {pollError && (
          <span className="ml-auto text-xs text-red-400 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
            ⚠ Simulator service unreachable
          </span>
        )}
        {isRunning && !pollError && (
          <span className="ml-auto text-xs text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block" /> Running · every {simStatus?.interval}s
          </span>
        )}
      </div>

      {/* Config Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-widest mb-4">Configuration</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Base Latitude</label>
            <input type="number" step="0.0001" value={baseLat} onChange={e => setBaseLat(+e.target.value)} disabled={isRunning}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:bg-gray-50" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Base Longitude</label>
            <input type="number" step="0.0001" value={baseLng} onChange={e => setBaseLng(+e.target.value)} disabled={isRunning}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:bg-gray-50" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Battery (%)</label>
            <input type="number" min={0} max={100} value={initBattery} onChange={e => setInitBattery(+e.target.value)} disabled={isRunning}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:bg-gray-50" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Interval (sec)</label>
            <input type="number" min={1} max={300} value={interval} onChange={e => setIntervalSec(+e.target.value)} disabled={isRunning}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:bg-gray-50" />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-xs text-gray-400 mb-1">
              Email <span className="text-gray-300">(optional, used to detect animal species)</span>
            </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} disabled={isRunning} placeholder="user@example.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:bg-gray-50" />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-xs text-gray-400 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} disabled={isRunning} placeholder="••••••••"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:bg-gray-50" />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5">
          {!isRunning ? (
            <button onClick={handleStart}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
              <Play size={16} /> Start Simulation
            </button>
          ) : (
            <button onClick={handleStop}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
              <Square size={16} /> Stop
            </button>
          )}
          <button onClick={handleReset}
            className="flex items-center gap-2 border border-gray-200 text-gray-500 hover:bg-gray-50 font-medium px-4 py-2.5 rounded-lg text-sm transition-colors">
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* Pets summary */}
      <div className="text-xs text-gray-400 space-y-1">
        <p>
          <span className="text-green-500 font-semibold">{petsWithDevices.length}</span> pet{petsWithDevices.length !== 1 ? 's' : ''} with devices: {petsWithDevices.map(p => p.petName).join(', ') || 'None'}
        </p>
        {petsWithoutDevices.length > 0 && (
          <p className="text-yellow-500">
            ⚠ {petsWithoutDevices.map(p => p.petName).join(', ')} - no device registered (skipped)
          </p>
        )}
      </div>

      {/* Add/remove pets while running */}
      {isRunning && petsWithDevices.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-widest mb-3">Manage Active Pets</h2>
          <div className="space-y-2">
            {petsWithDevices.map(p => {
              const active = activePetIds.includes(p.petId);
              return (
                <div key={p.petId} className={`flex items-center justify-between px-4 py-2.5 rounded-xl border ${active ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <PawPrint size={14} className={active ? 'text-green-500' : 'text-gray-400'} />
                    {p.petName}
                    {active && <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">active</span>}
                  </span>
                  {active ? (
                    <button onClick={() => handleRemovePet(p.petId)}
                      className="flex items-center gap-1 text-xs text-red-500 border border-red-200 hover:bg-red-50 px-2.5 py-1.5 rounded-lg">
                      <Minus size={12} /> Remove
                    </button>
                  ) : (
                    <button onClick={() => handleAddPet(p.petId)}
                      className="flex items-center gap-1 text-xs text-green-600 border border-green-200 hover:bg-green-50 px-2.5 py-1.5 rounded-lg">
                      <Plus size={12} /> Add
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Live readings */}
      {activePetIds.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activePetIds.map(petId => {
            const reading: SimulatorReading | undefined = readings[petId];
            const name = petNameMap[petId] ?? `Pet ${petId}`;
            return (
              <div key={petId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-400 px-5 py-4 text-white flex items-center gap-3">
                  <PawPrint size={20} />
                  <span className="font-bold text-lg">{name}</span>
                  <span className="text-indigo-200 text-xs">ID: {petId}</span>
                  {!reading && (
                    <span className="ml-auto text-xs text-indigo-200">Waiting for first tick…</span>
                  )}
                </div>
                {reading ? (
                  <div className="p-5 grid grid-cols-2 gap-3">
                    <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-3">
                      <Heart size={18} className="text-red-400" />
                      <div>
                        <p className="text-xs text-gray-400">Heart Rate</p>
                        <p className="text-lg font-bold text-gray-800">{reading.heartRate} <span className="text-xs text-gray-400">bpm</span></p>
                      </div>
                    </div>
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex items-center gap-3">
                      <Thermometer size={18} className="text-orange-400" />
                      <div>
                        <p className="text-xs text-gray-400">Temperature</p>
                        <p className="text-lg font-bold text-gray-800">{reading.temperature}°C</p>
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-center gap-3">
                      <MapPin size={18} className="text-green-500" />
                      <div>
                        <p className="text-xs text-gray-400">Location</p>
                        <p className="text-sm font-medium text-gray-700">{reading.latitude.toFixed(4)}, {reading.longitude.toFixed(4)}</p>
                      </div>
                    </div>
                    <div className={`rounded-xl p-3 flex items-center gap-3 border ${reading.batteryLevel > 20 ? 'bg-blue-50 border-blue-100' : 'bg-red-50 border-red-200'}`}>
                      <Zap size={18} className={reading.batteryLevel > 20 ? 'text-blue-500' : 'text-red-500'} />
                      <div className="flex-1">
                        <p className="text-xs text-gray-400">Battery</p>
                        <p className="text-lg font-bold text-gray-800">{reading.batteryLevel}%</p>
                      </div>
                      <button onClick={() => handleRecharge(petId)}
                        className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors">
                        <BatteryCharging size={12} /> Charge
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 text-center text-sm text-gray-400 flex items-center justify-center gap-2">
                    <Clock size={14} /> Waiting for first tick…
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!isRunning && activePetIds.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
          <Radio size={40} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400">Configure the parameters above and click <strong>Start Simulation</strong>.</p>
          <p className="text-gray-300 text-sm mt-1">The simulator service will run in the background and post telemetry continuously.</p>
        </div>
      )}
    </div>
  );
};

export default DeviceSimPage;

