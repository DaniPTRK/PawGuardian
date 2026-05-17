import type { HealthMetricDto } from '../apis/client/models';

export interface ChartPoint {
  time: string;
  date: string;
  heartRate?: number;
  temperature?: number;
  battery?: number;
}

// Maps timeseries to chart data (sorted, curated data)
export const toChartData = (history: HealthMetricDto[]): ChartPoint[] =>
  history
    .filter(h => h.timestamp)
    .sort((a, b) => new Date(a.timestamp!).getTime() - new Date(b.timestamp!).getTime())
    .map(h => ({
      time: new Date(h.timestamp!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date(h.timestamp!).toLocaleDateString(),
      heartRate: h.heartRate,
      temperature: h.temperature,
      battery: h.batteryLevel,
    }));

