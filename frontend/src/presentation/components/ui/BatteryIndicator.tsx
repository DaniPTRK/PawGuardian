import React from 'react';
import { getBatteryInfo } from '../../../infrastructure/utils/batteryUtils';

interface BatteryIndicatorProps {
  level?: number | null;
  showLabel?: boolean;
}

// Used for the special icon that's inside the battery stat card
const BatteryIndicator: React.FC<BatteryIndicatorProps> = ({ level, showLabel = true }) => {
  const { Icon, color, label } = getBatteryInfo(level);
  if (level == null) return <span className="text-gray-400 text-sm">-</span>;
  return (
    <div className="flex items-center gap-2">
      <Icon size={20} className={color} />
      <div>
        <p className="text-sm font-bold text-gray-800">{level}%</p>
        {showLabel && <p className={`text-xs font-medium ${color}`}>{label}</p>}
      </div>
    </div>
  );
};

export default BatteryIndicator;

