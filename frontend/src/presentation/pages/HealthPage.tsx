import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Heart, Thermometer, Cpu, Unplug, Plus } from 'lucide-react';
import { petApi, telemetryApi, deviceApi } from '../../infrastructure/apis/api-management';
import type { HealthMetricDto, DeviceResponseDto, DeviceRequestDto } from '../../infrastructure/apis/client/models';
import { getBatteryInfo } from '../../infrastructure/utils/batteryUtils';
import { toChartData } from '../../infrastructure/utils/chartUtils';
import { MetricChart, PetSelector, PageHeader, EmptyState } from '../components/ui';

const HealthPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: pets = [] } = useQuery({ queryKey: ['pets'], queryFn: () => petApi.getMyPets() });
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const effectivePetId = useMemo(
    () => selectedPetId ?? pets[0]?.id ?? null,
    [selectedPetId, pets]
  );
  const [showRegister, setShowRegister] = useState(false);
  const [deviceForm, setDeviceForm] = useState<Omit<DeviceRequestDto, 'petId'>>({ serialNumber: '', model: '' });

  const { data: history = [] } = useQuery<HealthMetricDto[]>({
    queryKey: ['health-history', effectivePetId],
    queryFn: () => telemetryApi.getHistory({ petId: effectivePetId! }),
    enabled: !!effectivePetId,
  });

  const { data: device } = useQuery<DeviceResponseDto>({
    queryKey: ['device', effectivePetId],
    queryFn: () => deviceApi.getDeviceForPet({ petId: effectivePetId! }),
    enabled: !!effectivePetId,
    retry: false,
  });

  const registerDevice = useMutation({
    mutationFn: (dto: DeviceRequestDto) => deviceApi.registerDevice({ deviceRequestDto: dto }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['device', effectivePetId] }); toast.success('Device registered!'); setShowRegister(false); setDeviceForm({ serialNumber: '', model: '' }); },
    onError: () => toast.error('Could not register device'),
  });

  const unpairDevice = useMutation({
    mutationFn: (petId: number) => deviceApi.removeDevice({ petId }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['device', effectivePetId] }); toast.success('Device unpaired'); },
    onError: () => toast.error('Failed to unpair device'),
  });

  const chartData = toChartData(history);
  const latestBat = chartData.length > 0 ? chartData[chartData.length - 1].battery : null;
  const { Icon: BatIcon, color: batColor, label: batLabel } = getBatteryInfo(latestBat);
  const selectedPet = pets.find(p => p.id === effectivePetId);

  return (
    <div className="space-y-6">
      <PageHeader title="Health Dashboard" />

      <PetSelector pets={pets} selectedId={selectedPetId} onSelect={setSelectedPetId} />

      {selectedPet && (
        <p className="text-sm text-gray-500">
          {selectedPet.name} · {selectedPet.breed ? `${selectedPet.breed} · ` : ''}{selectedPet.species} · {selectedPet.age} yrs
        </p>
      )}

      {chartData.length === 0 ? (
        <EmptyState
          icon={<Heart size={32} className="text-gray-300" />}
          message="No telemetry data yet for this pet."
        />
      ) : (
        <>
          <MetricChart
            title="Heart Rate (bpm)"
            icon={<Heart size={16} className="text-red-400" />}
            data={chartData}
            dataKey="heartRate"
            stroke="#ef4444"
            name="Heart Rate"
          />
          <MetricChart
            title="Temperature (°C)"
            icon={<Thermometer size={16} className="text-orange-400" />}
            data={chartData}
            dataKey="temperature"
            stroke="#f97316"
            name="Temperature"
          />
          {/* Battery chart with custom header */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <BatIcon size={16} className={batColor} /> Collar Battery
              </h2>
              <span className={`text-xs font-semibold ${batColor}`}>
                {batLabel} ({latestBat != null ? `${latestBat}%` : '-'})
              </span>
            </div>
            <MetricChart
              title=""
              icon={<></>}
              data={chartData}
              dataKey="battery"
              stroke="#3b82f6"
              height={180}
              yDomain={[0, 100]}
              name="Battery %"
            />
          </div>
        </>
      )}

      {/* Device info */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-4">
          <Cpu size={16} className="text-gray-500" /> Paired Device
        </h2>
        {device?.id ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Serial Number', value: device.serialNumber },
                { label: 'Model', value: device.model },
                { label: 'Battery', value: device.batteryLevel != null ? `${device.batteryLevel}%` : '-' },
                { label: 'Assigned To', value: device.petName ?? '-' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="font-semibold text-gray-800">{value}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => effectivePetId && unpairDevice.mutate(effectivePetId)}
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
                onSubmit={e => { e.preventDefault(); if (effectivePetId) registerDevice.mutate({ ...deviceForm, petId: effectivePetId }); }}
                className="space-y-3 border border-gray-200 rounded-xl p-4"
              >
                {(['serialNumber', 'model'] as const).map(field => (
                  <div key={field}>
                    <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                      {field === 'serialNumber' ? 'Serial Number' : 'Model'}
                    </label>
                    <input
                      value={deviceForm[field]}
                      onChange={e => setDeviceForm(f => ({ ...f, [field]: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                ))}
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
