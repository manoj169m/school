// components/SpeedAccuracyTradeOff.tsx
'use client';
import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  questionNumber: number;
  timeTaken: number;
}

const data: DataPoint[] = [
  { questionNumber: 10, timeTaken: 4 },
  { questionNumber: 20, timeTaken: 8 },
  { questionNumber: 30, timeTaken: 6 },
  { questionNumber: 40, timeTaken: 10 },
  { questionNumber: 50, timeTaken: 7 },
  { questionNumber: 60, timeTaken: 5 },
  { questionNumber: 70, timeTaken: 11 },
  { questionNumber: 80, timeTaken: 9 },
];

const SpeedAccuracyTradeOff: React.FC = () => {
  return (
    <div className="rounded-lg shadow-md bg-gray-50 p-6 mb-6">
      <h3 className="text-lg font-semibold mb-2">Speed vs Accuracy Trade Off</h3>
      <p className="text-sm text-gray-500 mb-4">Relationship between time taken and correctness of answers</p>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="questionNumber" name="Question Number" />
          <YAxis dataKey="timeTaken" name="Time Taken (seconds)" />
          <Tooltip />
          <Scatter name="Time vs Accuracy" data={data} fill="#3B82F6" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpeedAccuracyTradeOff;
