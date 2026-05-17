import React from 'react';
import { Trash2 } from 'lucide-react';

interface ConfirmModalProps {
  title: string;
  message: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  confirmClass?: string;
  isPending?: boolean;
}

// Modal that's used for confirming important actions (delete)
const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title, message, onConfirm, onCancel,
  confirmLabel = 'Confirm', confirmClass = 'bg-red-500 hover:bg-red-600', isPending = false,
}) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
      <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
        <Trash2 size={24} className="text-red-400" />
      </div>
      <h2 className="text-lg font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-sm text-gray-500 mb-6">{message}</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2 text-sm border rounded-lg hover:bg-gray-50">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isPending}
          className={`flex-1 py-2 text-sm text-white rounded-lg font-medium disabled:opacity-60 ${confirmClass}`}
        >
          {isPending ? 'Processing...' : confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;

