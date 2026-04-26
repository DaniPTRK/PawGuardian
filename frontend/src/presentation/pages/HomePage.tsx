import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  ChevronDown, ChevronUp, Heart, Map, MessageSquare, PawPrint,
  Thermometer, BatteryLow, BatteryMedium, BatteryFull, MapPin,
} from 'lucide-react';
import { petApi, telemetryApi } from '../../infrastructure/apis/api-management';
import { useOwnUser } from '../../infrastructure/hooks/useOwnUser';

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

type PetSummary = { id?: number; name?: string; species?: string; breed?: string; age?: number };

// Battery indicator component
const BatteryIndicator: React.FC<{ level?: number }> = ({ level }) => {
  if (level == null) return <span className="text-gray-400 text-sm">—</span>;
  const good = level > 50;
  const mid = level > 20;
  const Icon = good ? BatteryFull : mid ? BatteryMedium : BatteryLow;
  const color = good ? 'text-blue-500' : mid ? 'text-yellow-500' : 'text-red-500';
  const label = good ? 'Good' : mid ? 'Fair' : 'Low — Charge soon';
  return (
    <div className="flex items-center gap-2">
      <Icon size={20} className={color} />
      <div>
        <p className="text-sm font-bold text-gray-800">{level}%</p>
        <p className={`text-xs font-medium ${color}`}>{label}</p>
      </div>
    </div>
  );
};

// Individual pet dashboard card
const PetDashboard: React.FC<{ pet: PetSummary; others: PetSummary[] }> = ({ pet, others }) => {
  const [othersOpen, setOthersOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);

  const { data: telemetry } = useQuery({
    queryKey: ['telemetry-current', pet.id],
    queryFn: () => telemetryApi.getCurrentStatus1({ petId: pet.id! }),
    enabled: !!pet.id,
    refetchInterval: 30_000,
  });

  const hasLocation = telemetry?.latitude != null && telemetry?.longitude != null;
  const lastUpdated = telemetry?.timestamp
    ? new Date(telemetry.timestamp).toLocaleString()
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Pet header */}
      <div className="bg-gradient-to-r from-green-500 to-green-400 px-6 py-5 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
            <PawPrint size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold leading-tight">{pet.name}</h2>
            <p className="text-green-100 text-sm mt-0.5">
              {[pet.breed, pet.species].filter(Boolean).join(' · ')}
              {pet.age != null && <span> · {pet.age} yrs old</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Heart rate */}
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
            <Heart size={20} className="text-red-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Heart Rate</p>
            <p className="text-2xl font-bold text-gray-800 leading-tight">
              {telemetry?.heartRate ?? '—'}
              {telemetry?.heartRate != null && <span className="text-sm font-normal text-gray-400 ml-1">bpm</span>}
            </p>
          </div>
        </div>

        {/* Temperature */}
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
            <Thermometer size={20} className="text-orange-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Temperature</p>
            <p className="text-2xl font-bold text-gray-800 leading-tight">
              {telemetry?.temperature != null ? `${telemetry.temperature}°` : '—'}
              {telemetry?.temperature != null && <span className="text-sm font-normal text-gray-400 ml-1">C</span>}
            </p>
          </div>
        </div>

        {/* Collar battery */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
            <BatteryMedium size={20} className="text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Collar Battery</p>
            <BatteryIndicator level={telemetry?.batteryLevel} />
          </div>
        </div>
      </div>

      {/* Location section */}
      <div className="px-6 pb-5">
        <button
          onClick={() => setMapOpen(v => !v)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-green-600 transition-colors mb-3"
        >
          <MapPin size={16} className="text-green-500" />
          Last Known Location
          {lastUpdated && <span className="font-normal text-gray-400 text-xs ml-1">· {lastUpdated}</span>}
          {mapOpen ? <ChevronUp size={14} className="ml-auto" /> : <ChevronDown size={14} className="ml-auto" />}
        </button>

        {mapOpen && (
          hasLocation ? (
            <div className="rounded-xl overflow-hidden border border-gray-100" style={{ height: 280 }}>
              <MapContainer
                center={[telemetry!.latitude!, telemetry!.longitude!]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[telemetry!.latitude!, telemetry!.longitude!]} icon={greenIcon}>
                  <Popup>{pet.name}</Popup>
                </Marker>
              </MapContainer>
            </div>
          ) : (
            <div className="rounded-xl bg-gray-50 border border-gray-100 h-20 flex items-center justify-center">
              <p className="text-sm text-gray-400 italic">No location data available yet.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const { user } = useOwnUser();
  const { data: pets = [] } = useQuery({ queryKey: ['pets'], queryFn: () => petApi.getMyPets() });

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Good day, {user?.username ?? 'Pet Owner'}
        </h1>
        <p className="text-gray-400 text-sm mt-1">Here's your pet dashboard.</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <p className="text-3xl font-bold text-green-500">{pets.length}</p>
          <p className="text-xs text-gray-400 mt-1 font-medium">Total Pets</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <p className="text-3xl font-bold text-yellow-400">
            {new Set(pets.map(p => p.species).filter(Boolean)).size}
          </p>
          <p className="text-xs text-gray-400 mt-1 font-medium">Species</p>
        </div>
        <Link to="/map" className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-1">
          <Map size={22} className="text-yellow-500" />
          <span className="text-xs font-semibold text-gray-600">Safe Zones</span>
        </Link>
        <Link to="/feedback" className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-1">
          <MessageSquare size={22} className="text-green-400" />
          <span className="text-xs font-semibold text-gray-600">Feedback</span>
        </Link>
      </div>

      {/* Per-pet dashboards */}
      {pets.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
          <PawPrint size={40} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400">No pets added yet.</p>
          <Link to="/pets" className="mt-3 inline-block text-sm text-green-500 font-medium hover:underline">Add your first pet →</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {pets.map((pet, idx) => (
            <PetDashboard
              key={pet.id}
              pet={pet}
              others={pets.filter((_, i) => i !== idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
