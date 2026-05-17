import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle, Send, Trash2, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { useOwnUser } from '../../infrastructure/hooks/useOwnUser';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feedbackApi } from '../../infrastructure/apis/api-management';
import type { FeedbackResponseDto } from '../../infrastructure/apis/client/models';

const CATEGORY_LABELS: Record<string, string> = {
  mail_notifications: 'Mail Notifications',
  user_experience: 'User Experience',
  vet_service: 'Vet Service',
  pet_monitoring: 'Pet Monitoring',
  general: 'General',
};

const RECOMMEND_LABELS: Record<string, string> = {
  yes: '👍 Yes',
  maybe: 'Maybe',
  no: '👎 No',
};

type FeedbackEntry = FeedbackResponseDto;

const FeedbackCard: React.FC<{ fb: FeedbackEntry; onDelete: (id: number) => void; isDeleting: boolean }> = ({ fb, onDelete, isDeleting }) => {
  const [expanded, setExpanded] = useState(false);
  const rating = fb.rating ?? 0;

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <div className="flex items-start gap-4 px-4 py-3 bg-white hover:bg-gray-50 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm font-semibold text-gray-800 truncate">{fb.userEmail ?? 'Anonymous'}</span>
            {fb.category && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full shrink-0">
                {CATEGORY_LABELS[fb.category] ?? fb.category}
              </span>
            )}
            {fb.wouldRecommend && (
              <span className="text-xs text-gray-500 shrink-0">
                {RECOMMEND_LABELS[fb.wouldRecommend] ?? fb.wouldRecommend}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={13}
                className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 truncate">{fb.message}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0 mt-0.5">
          <span className="text-xs text-gray-400">
            {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : '-'}
          </span>
          <button
            onClick={() => setExpanded(v => !v)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
            title="Show details"
          >
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
          <button
            onClick={() => fb.id && onDelete(fb.id)}
            disabled={isDeleting}
            className="p-1 text-red-400 hover:text-red-600 rounded transition-colors disabled:opacity-40"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 space-y-2">
          <p className="text-sm text-gray-700">{fb.message}</p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Checkbox label="Email notifications accurate" checked={!!fb.mailAccuracyGood} />
            <Checkbox label="Experience friendly" checked={!!fb.experienceFriendly} />
            <Checkbox label="Satisfied with vet care" checked={!!fb.vetSatisfied} />
          </div>
        </div>
      )}
    </div>
  );
};

const Checkbox: React.FC<{ label: string; checked: boolean }> = ({ label, checked }) => (
  <span className={`text-xs flex items-center gap-1.5 px-2 py-1 rounded-full border ${
    checked ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-100 border-gray-200 text-gray-400 line-through'
  }`}>
    <span>{checked ? '✓' : '✗'}</span> {label}
  </span>
);
const FeedbackPage: React.FC = () => {
  const { user } = useOwnUser();
  const isAdmin = user?.roles?.some(r => r.includes('ADMIN'));
  const queryClient = useQueryClient();

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

  const { data: feedbackList = [] } = useQuery<FeedbackResponseDto[]>({
    queryKey: ['admin-feedback'],
    queryFn: () => feedbackApi.getAllFeedback(),
    enabled: !!isAdmin,
  });

  const submit = useMutation({
    mutationFn: () => feedbackApi.submitFeedback({
      feedbackRequestDto: {
        category: form.category,
        rating: parseInt(form.rating),
        message: form.message,
        wouldRecommend: form.wouldRecommend,
        mailAccuracyGood: form.mailAccuracyGood,
        experienceFriendly: form.experienceFriendly,
        vetSatisfied: form.vetSatisfied,
      },
    }),
    onSuccess: () => {
      toast.success('Thank you for your feedback!');
      setSubmitted(true);
      if (isAdmin) queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
    },
    onError: () => toast.error('Something went wrong. Please try again.'),
  });

  const deleteFeedback = useMutation({
    mutationFn: (id: number) => feedbackApi.deleteFeedback({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
      toast.success('Feedback deleted');
    },
    onError: () => toast.error('Failed to delete feedback'),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    setForm(f => ({
      ...f,
      [target.name]: target.type === 'checkbox' ? target.checked : target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category || !form.rating || !form.wouldRecommend || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    submit.mutate();
  };

  const resetForm = () => {
    setSubmitted(false);
    setForm({ category: '', rating: '', wouldRecommend: '', mailAccuracyGood: false, experienceFriendly: false, vetSatisfied: false, message: '' });
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
          onClick={resetForm}
          className="mt-6 text-green-600 text-sm font-semibold hover:underline"
        >
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Feedback</h1>
        <p className="text-sm text-gray-500 mb-6">Help us improve PawGuardian - your opinion matters!</p>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
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
                    <span className="text-xs text-gray-600">{['⭐', '⭐', '⭐', '⭐', '⭐'][Number(val)-1]} {val}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Would you recommend PawGuardian to a friend? <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-6">
                {[{ value: 'yes', label: '👍 Yes' }, { value: 'maybe', label: 'Maybe' }, { value: 'no', label: '👎 No' }].map(opt => (
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please check all that apply:
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="mailAccuracyGood" checked={form.mailAccuracyGood} onChange={handleChange} className="accent-green-500 w-4 h-4" />
                  <span className="text-sm text-gray-700">Email notifications are accurate and timely</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="experienceFriendly" checked={form.experienceFriendly} onChange={handleChange} className="accent-green-500 w-4 h-4" />
                  <span className="text-sm text-gray-700">The platform experience is friendly and intuitive</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="vetSatisfied" checked={form.vetSatisfied} onChange={handleChange} className="accent-green-500 w-4 h-4" />
                  <span className="text-sm text-gray-700">I am satisfied with the veterinary care assigned to my pets</span>
                </label>
              </div>
            </div>

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
              disabled={submit.isPending}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Send size={14} />
              {submit.isPending ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      </div>

      {isAdmin && (
        <div className="bg-white border border-gray-100 rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">All Submitted Feedback</h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              {feedbackList.length} {feedbackList.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
          {feedbackList.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No feedback submitted yet.</p>
          ) : (
            <div className="space-y-2">
              {(feedbackList as FeedbackEntry[]).map(fb => (
                <FeedbackCard
                  key={fb.id}
                  fb={fb}
                  onDelete={id => deleteFeedback.mutate(id)}
                  isDeleting={deleteFeedback.isPending}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
