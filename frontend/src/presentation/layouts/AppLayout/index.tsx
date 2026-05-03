import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Home, Map, Activity, User, MessageSquare, LogOut, Shield, Stethoscope, Radio } from 'lucide-react';
import { logout } from '../../../application/state-slices/profile';
import { useOwnUser } from '../../../infrastructure/hooks/useOwnUser';
import { ROUTES } from '../../../routes';
import logo from '../../../assets/PawGuardian_logo.png';

// general navbar items
const baseNavItems = [
  { to: ROUTES.HOME,     label: 'Home',     Icon: Home },
  { to: ROUTES.MAP,      label: 'Map',      Icon: Map },
  { to: ROUTES.HEALTH,   label: 'Health',   Icon: Activity },
  { to: ROUTES.PROFILE,  label: 'Profile',  Icon: User },
  { to: ROUTES.FEEDBACK, label: 'Feedback', Icon: MessageSquare },
];

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useOwnUser();


  const isAdmin = user?.roles?.some(r => r.includes('ADMIN'));
  const isVet = user?.roles?.some(r => r.includes('VET'));

  // Special navbar items
  const navItems = [
    ...baseNavItems,
    ...(isVet ? [{ to: ROUTES.VET, label: 'Patients', Icon: Stethoscope }] : []),
    ...(isAdmin ? [{ to: ROUTES.USERS, label: 'Admin', Icon: Shield }] : []),
    { to: ROUTES.DEV_SIM, label: 'DevSim', Icon: Radio },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Nav Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <img src={logo} alt="PawGuardian" className="h-10 w-auto object-contain" />
            <span className="font-bold text-gray-800 text-xl tracking-tight hidden sm:inline">PawGuardian</span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {navItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-green-50 text-green-600'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={16} className={isActive ? 'text-green-500' : 'text-gray-400'} />
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Sign out */}
          <button
            onClick={() => dispatch(logout())}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-400 transition-colors font-medium shrink-0"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-8 py-6 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
