import React from 'react';
import type { UserResponseDto } from '../../../infrastructure/apis/client/models';
import { PasswordRules } from '../ui';

interface Props {
  target: UserResponseDto;
  form: { username: string; newPassword: string };
  onChange: (field: 'username' | 'newPassword', value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isPending: boolean;
}

// Modal for changing user info
const EditUserModal: React.FC<Props> = ({ target, form, onChange, onSubmit, onClose, isPending }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Edit User {target.username}</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Username</label>
            <input
              value={form.username}
              onChange={e => onChange('username', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              New Password <span className="text-gray-400 font-normal">(blank = keep)</span>
            </label>
            <input
              type="password"
              value={form.newPassword}
              onChange={e => onChange('newPassword', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <PasswordRules password={form.newPassword} />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-sm border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium disabled:opacity-60"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;


