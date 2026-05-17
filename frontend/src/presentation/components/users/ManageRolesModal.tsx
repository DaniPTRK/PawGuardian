import React from 'react';
import { ShieldPlus, ShieldMinus } from 'lucide-react';
import type { UserResponseDto } from '../../../infrastructure/apis/client/models';

const AVAILABLE_ROLES = ['OWNER', 'VET', 'ADMIN'];

interface Props {
  target: UserResponseDto;
  onAdd: (role: string) => void;
  onRemove: (role: string) => void;
  onClose: () => void;
}

// Modal used by admins to change user roles
const ManageRolesModal: React.FC<Props> = ({ target, onAdd, onRemove, onClose }) => {
  const currentRoles = Array.from(target.roles ?? []);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-1">Manage Roles</h2>
        <p className="text-sm text-gray-500 mb-4">
          {target.username} ({target.email})
        </p>
        <div className="space-y-2 mb-5">
          {AVAILABLE_ROLES.map(role => {
            const has = currentRoles.includes(role);
            return (
              <div key={role} className="flex items-center justify-between p-3 rounded-xl border border-gray-200">
                <span className="text-sm font-medium text-gray-700">{role}</span>
                {has ? (
                  <button
                    onClick={() => onRemove(role)}
                    className="flex items-center gap-1 text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg"
                  >
                    <ShieldMinus size={12} /> Remove
                  </button>
                ) : (
                  <button
                    onClick={() => onAdd(role)}
                    className="flex items-center gap-1 text-xs text-green-600 hover:bg-green-50 px-2 py-1 rounded-lg"
                  >
                    <ShieldPlus size={12} /> Add
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <button
          onClick={onClose}
          className="w-full py-2 text-sm border rounded-lg hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ManageRolesModal;
