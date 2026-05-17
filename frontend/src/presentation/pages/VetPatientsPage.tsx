import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import 'leaflet/dist/leaflet.css';
import {
  ChevronDown, ChevronUp, Heart, Thermometer,
  PawPrint,
} from 'lucide-react';
import { vetApi } from '../../infrastructure/apis/api-management';
import { useOwnUser } from '../../infrastructure/hooks/useOwnUser';
import { useDebounce } from '../../infrastructure/hooks/useDebounce';
import type { PetResponseDto, HealthMetricDto } from '../../infrastructure/apis/client/models';
import { greenLeafletIcon } from '../../infrastructure/utils/mapUtils';
import { getBatteryInfo } from '../../infrastructure/utils/batteryUtils';
import { toChartData } from '../../infrastructure/utils/chartUtils';
import { PageHeader, SearchInput } from '../components/ui';

const PatientCard: React.FC<{ pet: PetResponseDto }> = ({ pet }) => {
  const [open, setOpen] = useState(false);

  const { data: telemetry } = useQuery<HealthMetricDto>({
    queryKey: ['vet-telemetry', pet.id],
    queryFn: () => vetApi.getCurrentStatus({ petId: pet.id! }),
    enabled: !!pet.id && open,
    refetchInterval: open ? 30_000 : false,
  });

  const { data: history = [] } = useQuery<HealthMetricDto[]>({
    queryKey: ['vet-history', pet.id],
    queryFn: () => vetApi.getHealthHistory({ petId: pet.id! }),
    enabled: !!pet.id && open,
  });

  // This data is essentially the same thing you'd see as a normal user
  const chartData = toChartData(history);
  const hasLoc = telemetry?.latitude != null && telemetry?.longitude != null;
  const lastUpdated = telemetry?.timestamp ? new Date(telemetry.timestamp).toLocaleString() : 'N/A';
  const { Icon: BatIcon, color: batColor } = getBatteryInfo(telemetry?.batteryLevel);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <button className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors" onClick={() => setOpen(v => !v)}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <PawPrint size={18} className="text-green-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-gray-800">{pet.name}</p>
            <p className="text-xs text-gray-400">{pet.breed ? `${pet.breed} · ` : ''}{pet.species} · {pet.age} yrs</p>
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>

      {open && (
        <div className="border-t border-gray-100 px-5 pb-5 pt-4 space-y-4">
          <p className="text-xs text-gray-400">Owner: {pet.ownerEmail ?? 'N/A'} · Last updated: {lastUpdated}</p>

          {/* Telemetry stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-red-50 rounded-xl p-3 text-center">
              <Heart size={16} className="text-red-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-800">{telemetry?.heartRate ?? 'N/A'}</p>
              <p className="text-xs text-gray-400">bpm</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-3 text-center">
              <Thermometer size={16} className="text-orange-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-800">{telemetry?.temperature != null ? `${telemetry.temperature}°` : 'N/A'}</p>
              <p className="text-xs text-gray-400">°C</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <BatIcon size={16} className={`${batColor} mx-auto mb-1`} />
              <p className="text-lg font-bold text-gray-800">{telemetry?.batteryLevel != null ? `${telemetry.batteryLevel}%` : 'N/A'}</p>
              <p className="text-xs text-gray-400">battery</p>
            </div>
          </div>

          {/* Mini map */}
          {hasLoc && (
            <div className="rounded-xl overflow-hidden" style={{ height: 180 }}>
              <MapContainer center={[telemetry!.latitude!, telemetry!.longitude!]} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false} scrollWheelZoom={false} dragging={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[telemetry!.latitude!, telemetry!.longitude!]} icon={greenLeafletIcon}>
                  <Popup>{pet.name}</Popup>
                </Marker>
              </MapContainer>
            </div>
          )}

          {/* Health history charts */}
          {chartData.length > 0 && (
            <div className="space-y-3">
              {[
                { bg: 'bg-red-50', icon: <Heart size={12} className="text-red-400" />, label: 'Heart Rate History', key: 'heartRate', stroke: '#ef4444' },
                { bg: 'bg-orange-50', icon: <Thermometer size={12} className="text-orange-400" />, label: 'Temperature History', key: 'temperature', stroke: '#f97316' },
              ].map(({ bg, icon, label, key, stroke }) => (
                <div key={key} className={`${bg} rounded-xl p-3`}>
                  <p className="text-xs font-semibold text-gray-500 flex items-center gap-1 mb-2">{icon} {label}</p>
                  <ResponsiveContainer width="100%" height={120}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="time" tick={{ fontSize: 9 }} />
                      <YAxis tick={{ fontSize: 9 }} domain={['auto', 'auto']} />
                      <Tooltip />
                      <Line type="monotone" dataKey={key} stroke={stroke} strokeWidth={1.5} dot={{ r: 1.5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const VetPatientsPage: React.FC = () => {
  const { user } = useOwnUser();
  const isVet = user?.roles?.some(r => r.includes('VET'));
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data: patients = [], isLoading } = useQuery<PetResponseDto[]>({
    queryKey: ['vet-patients'],
    queryFn: () => vetApi.getMyPatients(),
    enabled: !!isVet,
  });

  const filtered = patients.filter(p => {
    const q = debouncedSearch.toLowerCase();
    return !q || p.name?.toLowerCase().includes(q) || p.species?.toLowerCase().includes(q) || p.breed?.toLowerCase().includes(q) || p.ownerEmail?.toLowerCase().includes(q);
  });

  if (!isVet) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-400">You need the VET role to view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Patients"
        subtitle="View health, location, and status of assigned pets"
      />
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search patients by name, species, owner..."
      />
      {isLoading ? (
        <p className="text-center text-gray-400 py-8">Loading patients...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-8">No patients assigned yet.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(pet => <PatientCard key={pet.id} pet={pet} />)}
        </div>
      )}
    </div>
  );
};

export default VetPatientsPage;

