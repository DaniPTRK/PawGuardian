import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  ChevronDown, ChevronUp, Heart, Map, MessageSquare, PawPrint,
  Thermometer, BatteryMedium, MapPin,
} from 'lucide-react';
import { petApi, telemetryApi } from '../../infrastructure/apis/api-management';
import { useOwnUser } from '../../infrastructure/hooks/useOwnUser';
import { greenLeafletIcon } from '../../infrastructure/utils/mapUtils';
import { ROUTES } from '../../routes';
import BatteryIndicator from '../components/ui/BatteryIndicator';
import StatCard from '../components/ui/StatCard';
import EmptyState from '../components/ui/EmptyState';

type PetSummary = { id?: number; name?: string; species?: string; breed?: string; age?: number };

const PetDashboard: React.FC<{ pet: PetSummary }> = ({ pet }) => {
  const [mapOpen, setMapOpen] = useState(false);

  const { data: telemetry } = useQuery({
    queryKey: ['telemetry-current', pet.id],
    queryFn: () => telemetryApi.getCurrentStatus1({ petId: pet.id! }),
    enabled: !!pet.id,
    refetchInterval: 30_000,
  });

  const hasLocation = telemetry?.latitude != null && telemetry?.longitude != null;
  const lastUpdated = telemetry?.timestamp ? new Date(telemetry.timestamp).toLocaleString() : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Pet header */}
      <div className="bg-gradient-to-r from-green-500 to-green-400 px-6 py-5 text-white flex items-center gap-4">
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

      {/* Stats grid */}
      <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<Heart size={20} className="text-red-400" />}
          label="Heart Rate"
          value={telemetry?.heartRate}
          unit="bpm"
          bg="bg-red-50"
          border="border-red-100"
        />
        <StatCard
          icon={<Thermometer size={20} className="text-orange-400" />}
          label="Temperature"
          value={telemetry?.temperature != null ? `${telemetry.temperature}°` : null}
          unit="C"
          bg="bg-orange-50"
          border="border-orange-100"
        />
        <StatCard
          icon={<BatteryMedium size={20} className="text-blue-400" />}
          label="Collar Battery"
          value={null}
          bg="bg-blue-50"
          border="border-blue-100"
          extra={<BatteryIndicator level={telemetry?.batteryLevel} />}
        />
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
              <MapContainer center={[telemetry!.latitude!, telemetry!.longitude!]} zoom={15} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[telemetry!.latitude!, telemetry!.longitude!]} icon={greenLeafletIcon}>
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
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Good day, {user?.username ?? 'Pet Owner'}</h1>
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
        <Link to={ROUTES.MAP} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-1">
          <Map size={22} className="text-yellow-500" />
          <span className="text-xs font-semibold text-gray-600">Safe Zones</span>
        </Link>
        <Link to={ROUTES.FEEDBACK} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-1">
          <MessageSquare size={22} className="text-green-400" />
          <span className="text-xs font-semibold text-gray-600">Feedback</span>
        </Link>
      </div>

      {pets.length === 0 ? (
        <EmptyState
          icon={<PawPrint size={40} className="text-gray-200" />}
          message="No pets added yet."
          action={<Link to="/profile" className="text-sm text-green-500 font-medium hover:underline">Add your first pet →</Link>}
        />
      ) : (
        <div className="space-y-6">
          {pets.map(pet => <PetDashboard key={pet.id} pet={pet} />)}
        </div>
      )}
    </div>
  );
};

export default HomePage;
