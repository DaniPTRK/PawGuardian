import React from 'react';

interface StatCardProps {
  icon: React.ReactElement<{ size?: number; className?: string }>;
  label: string;
  value: string | number | null | undefined;
  unit?: string;
  bg?: string;
  border?: string;
  extra?: React.ReactNode;
}

// Used to map stats such as temperature, heart rate, battery level
const StatCard: React.FC<StatCardProps> = ({ icon, label, value, unit, bg = 'bg-gray-50', border = 'border-gray-100', extra }) => (
  <div className={`${bg} border ${border} rounded-xl p-4 flex items-center gap-4`}>
    <div className="w-10 h-10 bg-white/60 rounded-full flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
      {extra ?? (
        <p className="text-2xl font-bold text-gray-800 leading-tight">
          {value ?? 'N/A'}
          {value != null && unit && <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>}
        </p>
      )}
    </div>
  </div>
);

export default StatCard;

