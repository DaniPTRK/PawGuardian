import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Check, X } from 'lucide-react';
import { authApi } from '../../infrastructure/apis/api-management';
import logo from "../../assets/PawGuardian_logo.png";

const pwRules = (pw: string) => ({
  minLength: pw.length >= 8,
  hasUpper: /[A-Z]/.test(pw),
  hasDigit: /\d/.test(pw),
  hasSpecial: /[^A-Za-z0-9]/.test(pw),
});

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', username: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const rules = pwRules(form.password);

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
      await authApi.register({ registerDto: { email: form.email, username: form.username, password: form.password } });
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err: unknown) {
      let message = 'Registration failed. Please try again.';
      try {
        // Try to parse the backend error response body
        const res = err as { status?: number; json?: () => Promise<{ message?: string }> };
        if (res.json) {
          const body = await res.json();
          if (body?.message) message = body.message;
        }
      } catch { /* ignore parse errors */ }
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
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
              {form.password && (
                <ul className="mt-2 space-y-0.5 text-xs">
                  {[
                    { ok: rules.minLength, label: 'At least 8 characters' },
                    { ok: rules.hasUpper, label: 'At least one uppercase letter' },
                    { ok: rules.hasDigit, label: 'At least one digit' },
                    { ok: rules.hasSpecial, label: 'At least one special character (!@#$...)' },
                  ].map(r => (
                    <li key={r.label} className={`flex items-center gap-1.5 ${r.ok ? 'text-green-500' : 'text-gray-400'}`}>
                      {r.ok ? <Check size={12} /> : <X size={12} />} {r.label}
                    </li>
                  ))}
                </ul>
              )}
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

