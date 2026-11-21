'use client';
import React from 'react';

const AccuracyRate: React.FC = () => {
  return (
    <div className="rounded-lg shadow-md bg-gray-50 p-6 mb-6 flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-2">Accuracy Rate</h3>
      <p className="text-sm text-gray-500 mb-4">Great job! You&apos;ve achieved 67% accuracy. Keep improving!</p>
      <div className="text-center">
        <div className="text-6xl font-bold text-gray-800">67%</div>
        <div className="text-lg font-medium text-gray-500">Accuracy</div>
      </div>
    </div>
  );
};

export default AccuracyRate;
