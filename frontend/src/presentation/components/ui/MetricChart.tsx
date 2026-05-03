import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

interface MetricChartProps {
  title: string;
  icon: React.ReactElement;
  data: object[];
  dataKey: string;
  stroke: string;
  height?: number;
  xKey?: string;
  yDomain?: [number | string, number | string];
  name?: string;
}

// Charts which map the evolution of a timeseries data
const MetricChart: React.FC<MetricChartProps> = ({
  title, icon, data, dataKey, stroke, height = 220, xKey = 'time', yDomain, name,
}) => (
  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
    <h2 className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-3">
      {icon} {title}
    </h2>
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} domain={yDomain ?? ['auto', 'auto']} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={stroke}
          strokeWidth={2}
          dot={{ r: 2 }}
          name={name ?? dataKey}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default MetricChart;



