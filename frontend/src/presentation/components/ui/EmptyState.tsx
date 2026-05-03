import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  message: string;
  action?: React.ReactNode;
}

// Used to indicate an action when there's no data available
const EmptyState: React.FC<EmptyStateProps> = ({ icon, message, action }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
    <div className="flex justify-center mb-4">{icon}</div>
    <p className="text-gray-400">{message}</p>
    {action && <div className="mt-3">{action}</div>}
  </div>
);

export default EmptyState;

