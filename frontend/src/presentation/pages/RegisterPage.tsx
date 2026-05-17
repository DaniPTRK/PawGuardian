import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { authApi, userApi } from '../../infrastructure/apis/api-management';
import { setToken, setUser } from '../../application/state-slices/profile';
import { useAppRouter } from '../../infrastructure/hooks/useAppRouter';
import { extractErrorMessage } from '../../application/models/ErrorResponse';
import PasswordRules from '../components/ui/PasswordRules';
import logo from "../../assets/PawGuardian_logo.png";


const RegisterPage: React.FC = () => {
  const { goToHome, goToLogin } = useAppRouter();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: '', username: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const response = await authApi.register({ registerDto: { email: form.email, username: form.username, password: form.password } });
      if (response.accessToken) {
        dispatch(setToken(response.accessToken));
        try {
          const profile = await userApi.getMyProfile();
          dispatch(setUser({ id: profile.id, username: profile.username, email: profile.email, roles: profile.roles ? Array.from(profile.roles) : [] }));
        } catch { /* non-critical */ }
        toast.success('Account created! Welcome!');
        goToHome();
      } else {
        toast.success('Account created! Please sign in.');
        goToLogin();
      }
    } catch (err: unknown) {
      const message = await extractErrorMessage(err, 'Registration failed. Please try again.');
      toast.error(message, { duration: 5000 });
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
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">
          Welcome to PawGuardian
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">
          Create your account to get started
        </p>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                name="username"
                required
                value={form.username}
                onChange={handleChange}
                placeholder="Choose a username"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
              <PasswordRules password={form.password} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 font-medium hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

