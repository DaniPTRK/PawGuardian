import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import logo from '../../assets/PawGuardian_logo.png';
import { useAppRouter } from '../../infrastructure/hooks/useAppRouter';
import { authApi, userApi } from '../../infrastructure/apis/api-management';
import { setToken, setUser } from '../../application/state-slices/profile';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const { goToHome } = useAppRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authApi.login({ loginDto: { email, password } });
      if (response.accessToken) {
        dispatch(setToken(response.accessToken));
        // Fetch and store the user profile so username is available everywhere
        try {
          const profile = await userApi.getMyProfile();
          dispatch(setUser({ id: profile.id, username: profile.username, email: profile.email, roles: profile.roles ? Array.from(profile.roles) : [] }));
        } catch { /* ignore */ }
        goToHome();
      }
    } catch {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="PawGuardian" className="w-75 h-40 object-contain" />
        </div>
        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">
          Welcome to PawGuardian
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">
          Sign in to Monitor your pet
        </p>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-600 font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
