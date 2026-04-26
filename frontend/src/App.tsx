import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import type { RootState } from './application/store';
import AppLayout from './presentation/layouts/AppLayout/index';
import './App.css';

const LoginPage    = lazy(() => import('./presentation/pages/LoginPage'));
const RegisterPage = lazy(() => import('./presentation/pages/RegisterPage'));
const HomePage     = lazy(() => import('./presentation/pages/HomePage'));
const PetsPage     = lazy(() => import('./presentation/pages/PetsPage'));
const UsersPage    = lazy(() => import('./presentation/pages/UsersPage'));
const MapPage      = lazy(() => import('./presentation/pages/MapPage'));
const HealthPage   = lazy(() => import('./presentation/pages/HealthPage'));
const ProfilePage  = lazy(() => import('./presentation/pages/ProfilePage'));
const FeedbackPage = lazy(() => import('./presentation/pages/FeedbackPage'));

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
    Loading...
  </div>
);

function App() {
  const isAuthenticated = useSelector((s: RootState) => s.profile.isAuthenticated);

  return (
    <>
      <Toaster position="top-center" toastOptions={{ style: { fontSize: '14px' } }} />
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={!isAuthenticated ? <LoginPage />    : <Navigate to="/home" replace />} />
          <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/home" replace />} />
          <Route path="/" element={<Navigate to={isAuthenticated ? '/home' : '/login'} replace />} />

          {/* Protected routes where user must be authenticated*/}
          {isAuthenticated ? (
            <>
              <Route path="/home" element={<AppLayout><HomePage /></AppLayout>} />
              <Route path="/pets" element={<AppLayout><PetsPage /></AppLayout>} />
              <Route path="/users"    element={<AppLayout><UsersPage /></AppLayout>} />
              <Route path="/map"      element={<AppLayout><MapPage /></AppLayout>} />
              <Route path="/health"   element={<AppLayout><HealthPage /></AppLayout>} />
              <Route path="/profile"  element={<AppLayout><ProfilePage /></AppLayout>} />
              <Route path="/feedback" element={<AppLayout><FeedbackPage /></AppLayout>} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
