// components/ProgressChart.tsx
'use client';
import React from 'react';
import {  Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, Legend, ComposedChart } from 'recharts';

interface DataPoint {
  attempt: string;
  score: number;
}

const data: DataPoint[] = [
  { attempt: '01', score: 30 },
  { attempt: '02', score: 45 },
  { attempt: '03', score: 65 },
  { attempt: '04', score: 50 },
  { attempt: '05', score: 85 },
];

const ProgressChart: React.FC = () => {
  return (
    <div className="rounded-lg shadow-md bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">Progress Tracking</h3>
          <p className="text-sm text-gray-500">Improvement or decline in performance over multiple tests</p>
        </div>
        <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">Good Job</span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
  <ComposedChart
    data={data}
    margin={{
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    }}
  >
    <defs>
      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#34D399" stopOpacity={0.6} />
        <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.3} />
      </linearGradient>
    </defs>

    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="attempt" />
    <YAxis domain={[0, 100]} />
    <Tooltip />
    <Legend />

    {/* Area with Linear Gradient Fill */}
    <Area type="monotone" dataKey="score" stroke="#34D399" fill="url(#colorGradient)" fillOpacity={1} />

    {/* Line to Overlay the Area */}
    <Line type="monotone" dataKey="score" stroke="#34D399" />
  </ComposedChart>
</ResponsiveContainer>


    </div>
  );
};

export default ProgressChart;