// components/SectionScoreChart.tsx
'use client';
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface SectionScoreChartProps {
  data: { name: string; score: number }[];
}

const SectionScoreChart: React.FC<SectionScoreChartProps> = ({ data }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">Section-wise scores</h2>
      <ResponsiveContainer width="100%" height={300} className='pt-3'>
        <BarChart layout="vertical" data={data} barSize={40} >
        <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" hide    axisLine={{ stroke: "#D1D5DB", strokeOpacity: 0.5 }} />
          <YAxis
            type="category"
            dataKey="name"
            width={150}
            tick={{ fontSize: 14, fill: "#4B5563" }}
            axisLine={{ stroke: "#D1D5DB", strokeOpacity: 0.5 }}
            padding={{ top: 5, bottom: 5 }}
          />
          <Tooltip />
          <Bar dataKey="score" fill="#60A5FA" radius={[30, 30, 30, 30]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SectionScoreChart;
