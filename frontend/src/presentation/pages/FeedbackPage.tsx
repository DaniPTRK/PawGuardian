import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle, Send } from 'lucide-react';

const API_BASE = 'http://192.168.0.2:8090';

const FeedbackPage: React.FC = () => {
  // Define component state for form, submitting and loading
  const [form, setForm] = useState({
    category: '',
    rating: '',
    subscribe: false,
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handlers for changes done to the form and submitting the form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    setForm(f => ({
      ...f,
      [target.name]: target.type === 'checkbox' ? target.checked : target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category || !form.rating || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token') ?? '';
      const res = await fetch(`${API_BASE}/api/v1/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          category: form.category,
          rating: parseInt(form.rating),
          subscribe: form.subscribe,
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Thank you for your feedback!');
      setSubmitted(true);
    } catch {
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={32} className="text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Feedback Received!</h2>
        <p className="text-gray-400 text-sm">Thank you for helping us improve PawGuardian.</p>
        <button
          onClick={() => { setSubmitted(false); setForm({ category: '', rating: '', subscribe: false, message: '' }); }}
          className="mt-6 text-green-600 text-sm font-semibold hover:underline"
        >
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Feedback</h1>
      <p className="text-sm text-gray-500 mb-6">Help us improve PawGuardian</p>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
            >
              <option value="">Select a category...</option>
              <option value="general">General</option>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="performance">Performance</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Radio buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Rating <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-4">
              {['1', '2', '3', '4', '5'].map(val => (
                <label key={val} className="flex flex-col items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value={val}
                    checked={form.rating === val}
                    onChange={handleChange}
                    className="accent-green-500 w-4 h-4"
                  />
                  <span className="text-xs text-gray-600">{['😠','😕','😐','😊','😍'][Number(val)-1]} {val}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Checkbox */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="subscribe"
                checked={form.subscribe}
                onChange={handleChange}
                className="accent-green-500 w-4 h-4"
              />
              <span className="text-sm text-gray-700">I'd like to receive updates and news about PawGuardian</span>
            </label>
          </div>

          {/* Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Message <span className="text-red-400">*</span>
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              placeholder="Tell us what you think..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Send size={14} />
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage;
