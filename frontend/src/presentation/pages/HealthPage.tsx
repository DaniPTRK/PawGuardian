import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Heart, Thermometer, BatteryFull, BatteryMedium, BatteryLow,
  PawPrint, Cpu, Unplug, Plus,
} from 'lucide-react';
import { petApi, telemetryApi, deviceApi } from '../../infrastructure/apis/api-management';
import type { HealthMetricDto, DeviceResponseDto, DeviceRequestDto } from '../../infrastructure/apis/client/models';

const HealthPage: React.FC = () => {
  const qc = useQueryClient();
  const { data: pets = [] } = useQuery({ queryKey: ['pets'], queryFn: () => petApi.getMyPets() });
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [deviceForm, setDeviceForm] = useState<Omit<DeviceRequestDto, 'petId'>>({ serialNumber: '', model: '' });

  useEffect(() => {
    if (pets.length > 0 && selectedPetId === null) setSelectedPetId(pets[0].id ?? null);
  }, [pets]);

  const { data: history = [] } = useQuery<HealthMetricDto[]>({
    queryKey: ['health-history', selectedPetId],
    queryFn: () => telemetryApi.getHistory({ petId: selectedPetId! }),
    enabled: !!selectedPetId,
  });

  const { data: device } = useQuery<DeviceResponseDto>({
    queryKey: ['device', selectedPetId],
    queryFn: () => deviceApi.getDeviceForPet({ petId: selectedPetId! }),
    enabled: !!selectedPetId,
    retry: false,
  });

  const registerMutation = useMutation({
    mutationFn: (dto: DeviceRequestDto) => deviceApi.registerDevice({ deviceRequestDto: dto }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['device', selectedPetId] }); toast.success('Device registered!'); setShowRegister(false); setDeviceForm({ serialNumber: '', model: '' }); },
    onError: () => toast.error('Failed to register device'),
  });

  const removeMutation = useMutation({
    mutationFn: (petId: number) => deviceApi.removeDevice({ petId }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['device', selectedPetId] }); toast.success('Device unpaired'); },
    onError: () => toast.error('Failed to unpair device'),
  });

  // Prepare chart data sorted by timestamp
  const chartData = history
    .filter(h => h.timestamp)
    .sort((a, b) => new Date(a.timestamp!).getTime() - new Date(b.timestamp!).getTime())
    .map(h => ({
      time: new Date(h.timestamp!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date(h.timestamp!).toLocaleDateString(),
      heartRate: h.heartRate,
      temperature: h.temperature,
      battery: h.batteryLevel,
    }));

  const latestBat = chartData.length > 0 ? chartData[chartData.length - 1].battery : null;
  const BatIcon = latestBat != null ? (latestBat > 60 ? BatteryFull : latestBat > 25 ? BatteryMedium : BatteryLow) : BatteryMedium;
  const batColor = latestBat != null ? (latestBat > 60 ? 'text-blue-500' : latestBat > 25 ? 'text-yellow-500' : 'text-red-500') : 'text-gray-400';
  const batLabel = latestBat != null ? (latestBat > 60 ? 'Good' : latestBat > 25 ? 'Fair' : 'Low — Charge soon') : '—';

  const selectedPet = pets.find(p => p.id === selectedPetId);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Health Dashboard</h1>

      {/* Pet selector */}
      {pets.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {pets.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPetId(p.id!)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-colors whitespace-nowrap
                ${selectedPetId === p.id ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
            >
              <PawPrint size={14} /> {p.name}
            </button>
          ))}
        </div>
      )}

      {selectedPet && (
        <p className="text-sm text-gray-500">{selectedPet.name} · {selectedPet.breed ? `${selectedPet.breed} · ` : ''}{selectedPet.species} · {selectedPet.age} yrs</p>
      )}

      {chartData.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 text-center">
          <Heart size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No telemetry data yet for this pet.</p>
        </div>
      ) : (
        <>
          {/* Heart rate chart */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-3"><Heart size={16} className="text-red-400" /> Heart Rate (bpm)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                <Tooltip />
                <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} dot={{ r: 2 }} name="Heart Rate" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Temperature chart */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-3"><Thermometer size={16} className="text-orange-400" /> Temperature (°C)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                <Tooltip />
                <Line type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={2} dot={{ r: 2 }} name="Temperature" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Battery chart */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-600 flex items-center gap-2"><BatIcon size={16} className={batColor} /> Collar Battery</h2>
              <span className={`text-xs font-semibold ${batColor}`}>{batLabel} ({latestBat != null ? `${latestBat}%` : '—'})</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="battery" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} name="Battery %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Device info */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-4"><Cpu size={16} className="text-gray-500" /> Paired Device</h2>
        {device?.id ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-400">Serial Number</p>
                <p className="font-semibold text-gray-800">{device.serialNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Model</p>
                <p className="font-semibold text-gray-800">{device.model}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Battery</p>
                <p className="font-semibold text-gray-800">{device.batteryLevel != null ? `${device.batteryLevel}%` : '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Assigned To</p>
                <p className="font-semibold text-gray-800">{device.petName ?? '—'}</p>
              </div>
            </div>
            <button
              onClick={() => selectedPetId && removeMutation.mutate(selectedPetId)}
              className="flex items-center gap-1.5 text-sm text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors border border-red-200"
            >
              <Unplug size={14} /> Unpair Device
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-400 mb-3">No device paired to this pet.</p>
            {!showRegister ? (
              <button onClick={() => setShowRegister(true)} className="flex items-center gap-1.5 text-sm bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium">
                <Plus size={14} /> Register Device
              </button>
            ) : (
              <form
                onSubmit={e => { e.preventDefault(); if (selectedPetId) registerMutation.mutate({ ...deviceForm, petId: selectedPetId }); }}
                className="space-y-3 border border-gray-200 rounded-xl p-4"
              >
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Serial Number</label>
                  <input value={deviceForm.serialNumber} onChange={e => setDeviceForm(f => ({ ...f, serialNumber: e.target.value }))} required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Model</label>
                  <input value={deviceForm.model} onChange={e => setDeviceForm(f => ({ ...f, model: e.target.value }))} required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowRegister(false)} className="flex-1 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="flex-1 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium">Register</button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthPage;
