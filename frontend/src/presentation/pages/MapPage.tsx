import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PawPrint, Layers, Plus, Pencil, Trash2, Check, X, MapPin, AlertTriangle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { petApi, telemetryApi, safeZoneApi } from '../../infrastructure/apis/api-management';
import type { SafeZoneResponseDto, GeofenceCheckResponseDto } from '../../infrastructure/apis/client/models';

const ZONE_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4', '#f97316', '#ec4899'];

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

// Clickable map component for drawing zone vertices
const ZoneDrawer: React.FC<{ onAdd: (lat: number, lng: number) => void; active: boolean }> = ({ onAdd, active }) => {
  useMapEvents({ click: (e) => { if (active) onAdd(e.latlng.lat, e.latlng.lng); } });
  return null;
};

const MapPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: pets = [] } = useQuery({ queryKey: ['pets'], queryFn: () => petApi.getMyPets() });
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [zonesVisible, setZonesVisible] = useState(true);

  // Zone editing state
  const [editingZone, setEditingZone] = useState<SafeZoneResponseDto | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');
  const [drawnVertices, setDrawnVertices] = useState<{ latitude: number; longitude: number }[]>([]);

  useEffect(() => {
    if (pets.length > 0 && selectedPetId === null) {
      setSelectedPetId(pets[0].id ?? null);
    }
  }, [pets]);

  const { data: telemetry } = useQuery({
    queryKey: ['telemetry-current', selectedPetId],
    queryFn: () => telemetryApi.getCurrentStatus1({ petId: selectedPetId! }),
    enabled: !!selectedPetId,
    refetchInterval: 30_000,
  });

  const { data: zones = [] } = useQuery({
    queryKey: ['safe-zones', selectedPetId],
    queryFn: () => safeZoneApi.getSafeZones1({ petId: selectedPetId! }),
    enabled: !!selectedPetId,
  });

  const hasLocation = telemetry?.latitude != null && telemetry?.longitude != null;

  // Geofence check
  const { data: geofenceStatus } = useQuery<GeofenceCheckResponseDto>({
    queryKey: ['geofence-check', selectedPetId, telemetry?.latitude, telemetry?.longitude],
    queryFn: () => safeZoneApi.checkGeofence({
      petId: selectedPetId!,
      geofenceCheckRequestDto: { latitude: telemetry!.latitude!, longitude: telemetry!.longitude! },
    }),
    enabled: !!selectedPetId && hasLocation && zones.length > 0,
    refetchInterval: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: (vars: { zoneName: string; vertices: { latitude: number; longitude: number }[] }) =>
      safeZoneApi.createSafeZone({ petId: selectedPetId!, safeZoneRequestDto: { zoneName: vars.zoneName, active: true, vertices: vars.vertices } }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['safe-zones', selectedPetId] }); toast.success('Zone created'); resetDraw(); },
    onError: () => toast.error('Failed to create zone'),
  });

  const updateMutation = useMutation({
    mutationFn: (vars: { zoneId: number; zoneName: string; vertices: { latitude: number; longitude: number }[] }) =>
      safeZoneApi.updateSafeZone({ petId: selectedPetId!, zoneId: vars.zoneId, safeZoneRequestDto: { zoneName: vars.zoneName, active: true, vertices: vars.vertices } }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['safe-zones', selectedPetId] }); toast.success('Zone updated'); resetDraw(); },
    onError: () => toast.error('Failed to update zone'),
  });

  const deleteMutation = useMutation({
    mutationFn: (zoneId: number) => safeZoneApi.deleteSafeZone({ petId: selectedPetId!, zoneId }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['safe-zones', selectedPetId] }); toast.success('Zone deleted'); },
    onError: () => toast.error('Failed to delete zone'),
  });

  const resetDraw = () => { setIsCreating(false); setEditingZone(null); setDrawnVertices([]); setNewZoneName(''); };

  const startEdit = (zone: SafeZoneResponseDto) => {
    setEditingZone(zone);
    setIsCreating(false);
    setNewZoneName(zone.zoneName ?? '');
    setDrawnVertices(zone.vertices ?? []);
  };

  const handleSave = () => {
    if (!newZoneName.trim()) { toast.error('Enter a zone name'); return; }
    if (drawnVertices.length < 3) { toast.error('Draw at least 3 points'); return; }
    if (editingZone?.id) {
      updateMutation.mutate({ zoneId: editingZone.id, zoneName: newZoneName, vertices: drawnVertices });
    } else {
      createMutation.mutate({ zoneName: newZoneName, vertices: drawnVertices });
    }
  };

  const center: [number, number] = hasLocation ? [telemetry!.latitude!, telemetry!.longitude!] : [44.4268, 26.1025];
  const lastUpdated = telemetry?.timestamp ? new Date(telemetry.timestamp).toLocaleString() : null;
  const isDrawing = isCreating || !!editingZone;
  const selectedPet = pets.find(p => p.id === selectedPetId);

  return (
    <div className="flex h-[calc(100vh-5rem)]">
      {/* Left sidebar */}
      <div className="w-72 shrink-0 bg-white border-r border-gray-100 flex flex-col overflow-y-auto">
        {/* Pet selector */}
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Pet</h2>
          {pets.length > 1 ? (
            <div className="space-y-1">
              {pets.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPetId(p.id!)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left
                    ${selectedPetId === p.id ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <PawPrint size={14} /> {p.name}
                </button>
              ))}
            </div>
          ) : selectedPet ? (
            <p className="text-sm font-semibold text-gray-700 flex items-center gap-2"><PawPrint size={14} className="text-green-500" /> {selectedPet.name}</p>
          ) : null}
        </div>

        {/* Geofence status banner */}
        {hasLocation && zones.length > 0 && (
          <div className={`mx-4 mt-4 p-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
            geofenceStatus?.insideSafeZone
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            {geofenceStatus?.insideSafeZone
              ? <><ShieldCheck size={16} /> {selectedPet?.name} is in <strong>{geofenceStatus.safeZoneName}</strong></>
              : <><AlertTriangle size={16} /> {selectedPet?.name} is not in any safe zone</>}
          </div>
        )}

        {/* Location info */}
        <div className="p-4 border-b border-gray-100">
          <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={11} /> Last updated</p>
          <p className="text-sm text-gray-600 font-medium">{lastUpdated ?? 'No data'}</p>
        </div>

        {/* Zone toggle */}
        <div className="px-4 pt-4">
          <button
            onClick={() => setZonesVisible(v => !v)}
            className={`w-full flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-colors
              ${zonesVisible ? 'bg-yellow-50 border-yellow-300 text-yellow-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
          >
            <Layers size={13} /> {zonesVisible ? 'Zones Visible' : 'Zones Hidden'}
          </button>
        </div>

        {/* Safe zones list */}
        <div className="p-4 flex-1">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Safe Zones</h2>
            {selectedPetId && !isDrawing && (
              <button
                onClick={() => { setIsCreating(true); setDrawnVertices([]); setNewZoneName(''); }}
                className="flex items-center gap-1 text-xs bg-green-500 text-white px-2.5 py-1 rounded-full font-semibold hover:bg-green-600"
              >
                <Plus size={12} /> New
              </button>
            )}
          </div>

          {/* Drawing form */}
          {isDrawing && (
            <div className="space-y-2 mb-4 bg-indigo-50 rounded-xl p-3">
              <input
                className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                placeholder="Zone name"
                value={newZoneName}
                onChange={e => setNewZoneName(e.target.value)}
              />
              <p className="text-xs text-indigo-500">Click the map to add vertices ({drawnVertices.length})</p>
              <div className="flex gap-1.5">
                <button onClick={() => setDrawnVertices(v => v.slice(0, -1))} className="flex-1 text-xs border border-indigo-200 text-indigo-500 rounded-lg py-1.5 hover:bg-indigo-100">Undo</button>
                <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-1 bg-green-500 text-white text-xs rounded-lg py-1.5 font-semibold hover:bg-green-600"><Check size={12} /> Save</button>
                <button onClick={resetDraw} className="px-2 text-xs border border-indigo-200 text-indigo-500 rounded-lg py-1.5 hover:bg-indigo-100"><X size={12} /></button>
              </div>
            </div>
          )}

          {zones.length === 0 && !isDrawing && (
            <p className="text-xs text-gray-400 italic">No safe zones defined.</p>
          )}

          <div className="space-y-2">
            {zones.map((zone, idx) => (
              <div key={zone.id} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: ZONE_COLORS[idx % ZONE_COLORS.length] }} />
                <span className="text-sm font-medium text-gray-700 flex-1 truncate">{zone.zoneName}</span>
                <button onClick={() => startEdit(zone)} className="p-1 text-gray-400 hover:text-blue-500"><Pencil size={13} /></button>
                <button onClick={() => zone.id && deleteMutation.mutate(zone.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={13} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map area */}
      <div className="flex-1 relative">
        <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ZoneDrawer active={isDrawing} onAdd={(lat, lng) => setDrawnVertices(v => [...v, { latitude: lat, longitude: lng }])} />

          {hasLocation && (
            <Marker position={[telemetry!.latitude!, telemetry!.longitude!]} icon={greenIcon}>
              <Popup>
                <strong>{selectedPet?.name ?? 'Pet'}</strong>
                {lastUpdated && <><br /><span className="text-xs text-gray-400">Updated: {lastUpdated}</span></>}
              </Popup>
            </Marker>
          )}

          {zonesVisible && zones.map((zone, idx) => {
            const positions = (zone.vertices ?? []).map(v => [v.latitude, v.longitude] as [number, number]);
            if (positions.length < 3) return null;
            const color = ZONE_COLORS[idx % ZONE_COLORS.length];
            return (
              <Polygon key={zone.id} positions={positions} pathOptions={{ color, fillColor: color, fillOpacity: 0.18 }}>
                <Popup>{zone.zoneName}</Popup>
              </Polygon>
            );
          })}

          {isDrawing && drawnVertices.length >= 3 && (
            <Polygon
              positions={drawnVertices.map(v => [v.latitude, v.longitude] as [number, number])}
              pathOptions={{ color: '#6366f1', fillColor: '#6366f1', fillOpacity: 0.2, dashArray: '6' }}
            />
          )}
        </MapContainer>

        {/* Floating geofence banner on map */}
        {hasLocation && zones.length > 0 && geofenceStatus && (
          <div className={`absolute top-3 left-1/2 -translate-x-1/2 z-[1000] px-4 py-2 rounded-full shadow-lg text-sm font-semibold flex items-center gap-2 ${
            geofenceStatus.insideSafeZone
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}>
            {geofenceStatus.insideSafeZone
              ? <><ShieldCheck size={15} /> In "{geofenceStatus.safeZoneName}"</>
              : <><AlertTriangle size={15} /> Outside all safe zones</>}
          </div>
        )}

        {isDrawing && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000] bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-full shadow">
            Click map to add vertices ({drawnVertices.length})
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
