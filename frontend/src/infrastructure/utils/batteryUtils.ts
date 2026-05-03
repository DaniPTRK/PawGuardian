import { BatteryFull, BatteryMedium, BatteryLow } from 'lucide-react';

export interface BatteryInfo {
  Icon: typeof BatteryFull;
  color: string;
  label: string;
}

// Returns a battery icon, color and label associated to a given level of battery
export const getBatteryInfo = (level: number | null | undefined): BatteryInfo => {
  if (level == null) {
    return { Icon: BatteryMedium, color: 'text-gray-400', label: 'N/A' };
  }
  if (level > 60) return { Icon: BatteryFull, color: 'text-blue-500', label: 'Good' };
  if (level > 25) return { Icon: BatteryMedium, color: 'text-yellow-500', label: 'Fair' };
  return { Icon: BatteryLow, color: 'text-red-500', label: 'Low - Charge soon' };
};

