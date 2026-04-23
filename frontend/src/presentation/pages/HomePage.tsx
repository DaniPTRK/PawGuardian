import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { petApi } from '../../infrastructure/apis/api-management';
import { useOwnUser } from '../../infrastructure/hooks/useOwnUser';

const PawSvg = () => (
  <svg viewBox="0 0 64 64" className="w-6 h-6 text-green-500" fill="currentColor">
    <ellipse cx="12" cy="20" rx="5" ry="7" />
    <ellipse cx="26" cy="14" rx="5" ry="7" />
    <ellipse cx="40" cy="14" rx="5" ry="7" />
    <ellipse cx="54" cy="20" rx="4" ry="6" />
    <path d="M32 26c-9 0-18 7-16 18 1 5 5 9 9 9 2 0 4-1 7-1s5 1 7 1c4 0 8-4 9-9 2-11-7-18-16-18z" />
  </svg>
);

const HeartSvg = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 text-red-400" fill="currentColor">
    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
  </svg>
);

const MapSvg = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503-9.998l-3.744 8.748a.375.375 0 01-.712-.057L9.001 7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChatSvg = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>
);

const HomePage: React.FC = () => {
  const { user } = useOwnUser();
  const { data: pets = [] } = useQuery({ queryKey: ['pets'], queryFn: () => petApi.getMyPets() });

  const speciesCount = new Set(pets.map((p) => p.species).filter(Boolean)).size;

  return (
    <div className="p-4 space-y-5">

      {/* Greeting banner */}
      <div className="bg-green-500 rounded-2xl p-5 text-white">
        <p className="text-green-100 text-sm">Good day,</p>
        <h1 className="text-xl font-bold">{user?.username ?? 'Pet Owner'}</h1>
        <p className="text-green-100 text-sm mt-1">Here's your pet dashboard.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
          <p className="text-3xl font-bold text-green-500">{pets.length}</p>
          <p className="text-xs text-gray-400 mt-1 font-medium">Total Pets</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
          <p className="text-3xl font-bold text-yellow-400">{speciesCount}</p>
          <p className="text-xs text-gray-400 mt-1 font-medium">Species</p>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { to: '/pets',     label: 'Manage Pets',     Icon: <PawSvg />,  bg: 'bg-green-50',  border: 'border-green-100' },
            { to: '/health',   label: 'Health Records',  Icon: <HeartSvg />, bg: 'bg-red-50',    border: 'border-red-100' },
            { to: '/map',      label: 'Safe Zones',      Icon: <MapSvg />,   bg: 'bg-yellow-50', border: 'border-yellow-100' },
            { to: '/feedback', label: 'Feedback',        Icon: <ChatSvg />,  bg: 'bg-green-50',  border: 'border-green-100' },
          ].map(({ to, label, Icon, bg, border }) => (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-2 ${bg} border ${border} rounded-2xl p-4 shadow-sm hover:shadow-md transition-all`}
            >
              {Icon}
              <span className="text-xs font-semibold text-gray-700">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent pets */}
      {pets.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Your Pets</h2>
          <div className="space-y-2">
            {pets.slice(0, 3).map((pet) => (
              <div key={pet.id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <PawSvg />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{pet.name}</p>
                  <p className="text-xs text-gray-400">{pet.species} · {pet.age} yrs</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
