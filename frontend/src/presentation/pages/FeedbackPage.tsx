import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle, Send, Trash2 } from 'lucide-react';
import { useOwnUser } from '../../infrastructure/hooks/useOwnUser';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE = 'http://192.168.0.2:8090';

// What the feedback form contains
type FeedbackItem = {
  id: number;
  userEmail: string;
  category: string;
  rating: number;
  wouldRecommend: string;
  mailAccuracyGood: boolean;
  experienceFriendly: boolean;
  vetSatisfied: boolean;
  message: string;
  createdAt: string;
};

const FeedbackPage: React.FC = () => {
  const { user } = useOwnUser();
  const isAdmin = user?.roles?.some(r => r.includes('ADMIN'));
  const qc = useQueryClient();

  const [form, setForm] = useState({
    category: '',
    rating: '',
    wouldRecommend: '',
    mailAccuracyGood: false,
    experienceFriendly: false,
    vetSatisfied: false,
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Admin: fetch all feedback
  const { data: feedbackList = [] } = useQuery<FeedbackItem[]>({
    queryKey: ['admin-feedback'],
    queryFn: async () => {
      const token = localStorage.getItem('token') ?? '';
      const res = await fetch(`${API_BASE}/api/v1/feedback`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    enabled: !!isAdmin,
  });

  const deleteFeedbackMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem('token') ?? '';
      const res = await fetch(`${API_BASE}/api/v1/feedback/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed');
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-feedback'] }); toast.success('Feedback deleted'); },
    onError: () => toast.error('Failed to delete feedback'),
  });

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
    if (!form.category || !form.rating || !form.wouldRecommend || !form.message) {
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
          wouldRecommend: form.wouldRecommend,
          mailAccuracyGood: form.mailAccuracyGood,
          experienceFriendly: form.experienceFriendly,
          vetSatisfied: form.vetSatisfied,
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Thank you for your feedback!');
      setSubmitted(true);
      if (isAdmin) qc.invalidateQueries({ queryKey: ['admin-feedback'] });
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
          onClick={() => { setSubmitted(false); setForm({ category: '', rating: '', wouldRecommend: '', mailAccuracyGood: false, experienceFriendly: false, vetSatisfied: false, message: '' }); }}
          className="mt-6 text-green-600 text-sm font-semibold hover:underline"
        >
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Submit feedback form */}
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Feedback</h1>
        <p className="text-sm text-gray-500 mb-6">Help us improve PawGuardian - your opinion matters!</p>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Select - Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What aspect are you giving feedback on? <span className="text-red-400">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              >
                <option value="">Select a category...</option>
                <option value="mail_notifications">Mail Notifications & Accuracy</option>
                <option value="user_experience">User Experience & Interface</option>
                <option value="vet_service">Veterinary Service Quality</option>
                <option value="pet_monitoring">Pet Monitoring & Tracking</option>
                <option value="general">General / Other</option>
              </select>
            </div>

            {/* Radio buttons - Overall Rating */}
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

            {/* Radio buttons - Would Recommend */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Would you recommend PawGuardian to a friend? <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-6">
                {[{ value: 'yes', label: '👍 Yes' }, { value: 'maybe', label: '🤔 Maybe' }, { value: 'no', label: '👎 No' }].map(opt => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="wouldRecommend"
                      value={opt.value}
                      checked={form.wouldRecommend === opt.value}
                      onChange={handleChange}
                      className="accent-green-500 w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Checkboxes - Multiple aspects */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please check all that apply:
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="mailAccuracyGood"
                    checked={form.mailAccuracyGood}
                    onChange={handleChange}
                    className="accent-green-500 w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">Email notifications are accurate and timely</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="experienceFriendly"
                    checked={form.experienceFriendly}
                    onChange={handleChange}
                    className="accent-green-500 w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">The platform experience is friendly and intuitive</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="vetSatisfied"
                    checked={form.vetSatisfied}
                    onChange={handleChange}
                    className="accent-green-500 w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">I am satisfied with the veterinary care assigned to my pets</span>
                </label>
              </div>
            </div>

            {/* Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Comments <span className="text-red-400">*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us more about your experience, suggestions, or any issues you've encountered..."
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

      {/* Admin feedback table - shown below the form */}
      {isAdmin && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">All Submitted Feedback (Admin)</h2>
          {feedbackList.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No feedback submitted yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left">User</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Rating</th>
                    <th className="px-4 py-3 text-left">Recommend</th>
                    <th className="px-4 py-3 text-left">Message</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {feedbackList.map(fb => (
                    <tr key={fb.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600 text-xs">{fb.userEmail}</td>
                      <td className="px-4 py-3"><span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">{fb.category}</span></td>
                      <td className="px-4 py-3 text-gray-600">{'⭐'.repeat(fb.rating)}</td>
                      <td className="px-4 py-3 text-gray-600 capitalize">{fb.wouldRecommend}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{fb.message}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : '-'}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => deleteFeedbackMutation.mutate(fb.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete feedback"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
