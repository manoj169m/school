// components/TimeManagementChart.tsx
'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  subject: string;
  totalQuestions: number;
  unansweredQuestions: number;
  timeSpent: number;
}

const data: DataPoint[] = [
  { subject: 'English', totalQuestions: 10, unansweredQuestions: 4, timeSpent: 8 },
  { subject: 'G Factor', totalQuestions: 10, unansweredQuestions: 2, timeSpent: 7 },
  { subject: 'GK', totalQuestions: 10, unansweredQuestions: 3, timeSpent: 9 },
  { subject: 'Analogy', totalQuestions: 10, unansweredQuestions: 5, timeSpent: 6 },
  { subject: 'Classification', totalQuestions: 10, unansweredQuestions: 3, timeSpent: 7 },
  { subject: 'Interest', totalQuestions: 10, unansweredQuestions: 1, timeSpent: 5 },
];

const TimeManagementChart: React.FC = () => {
  return (
    <div className="rounded-lg shadow-md bg-gray-100 p-6 mb-6">
      <h3 className="text-lg font-semibold mb-2">Time Management</h3>
      <p className="text-sm text-gray-500 mb-4">Time spent on each section and questions answered</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="subject" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalQuestions" fill="#60A5FA" name="Total Questions" radius={[10, 10, 0, 0]} />
          <Bar dataKey="unansweredQuestions" fill="#34D399" name="Unanswered Questions" radius={[10, 10, 0, 0]} />
          <Line type="monotone" dataKey="timeSpent" stroke="#F59E0B" name="Time Spent on Each Section" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeManagementChart;
