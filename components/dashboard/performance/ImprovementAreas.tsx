// components/ImprovementAreas.tsx
'use client';
import React from 'react';

interface ImprovementData {
  topic: string;
  level: number;
  status: 'Critical' | 'Improve' | 'Focus';
}

const data: ImprovementData[] = [
  { topic: 'Analogy', level: 90, status: 'Critical' },
  { topic: 'Decimals', level: 70, status: 'Improve' },
  { topic: 'Reasoning', level: 50, status: 'Improve' },
  { topic: 'Percentage', level: 85, status: 'Focus' },
  { topic: 'Current Affairs', level: 95, status: 'Focus' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Critical':
      return 'bg-red-500 text-white';
    case 'Improve':
      return 'bg-orange-400 text-white';
    case 'Focus':
      return 'bg-yellow-400 text-black';
    default:
      return '';
  }
};

const ImprovementAreas: React.FC = () => {
  return (
    <div className="rounded-lg shadow-md bg-gray-50 p-6 mb-6">
      <h3 className="text-lg font-semibold mb-2">Improvement Areas</h3>
      <p className="text-sm text-gray-500 mb-4">
        Suggestions for topics or skills that need more focus based on performance
      </p>
      <div className="space-y-4">
  {data.map((item, index) => (
    <div key={index} className="flex items-center">
      <span className="w-8 text-sm font-semibold text-gray-700">{index + 1}.</span>
      <div className="flex-1 mr-4">
        <div className="relative h-4 rounded-lg mt-1 process" style={{ width: `${item.level}%` }}>
          {/* Topic Name inside the Progress Bar */}
          <div
            className="bg-blue-500 h-4 rounded-lg flex items-center justify-center text-white text-xs font-medium"
            style={{ width: `${item.level}%` }}
          >
            {item.topic}
          </div>
        </div>
      </div>
      {/* Status After the Process */}
      <span className={`status px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
        {item.status}
      </span>
    </div>
  ))}
</div>

    </div>
  );
};

export default ImprovementAreas;
