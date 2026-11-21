// MockTestResult.tsx
'use client';
import React from 'react';
import { CircleCheckBig ,CircleX,CircleMinus,SquarePen,View} from 'lucide-react';

interface MockTestResultProps {
  testName: string;
  correct: number;
  wrong: number;
  skipped: number;
  attempts: number;
  percentage: number;
}

const MockTestResult: React.FC<MockTestResultProps> = ({ 
  testName, 
  correct, 
  wrong, 
  skipped, 
  attempts, 
  // percentage 
}) => {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-100">
  <div>
    <h2 className="font-bold text-lg">{testName}</h2>
    <div className="flex items-center gap-4 mt-2">
      <span className="flex items-center gap-1 text-sm text-gray-600">
        <CircleCheckBig className="size-4" /> {correct} Correct
      </span>
      <span className="flex items-center gap-1 text-sm text-gray-600">
        <CircleX className="size-4" /> {wrong} Wrong
      </span>
      <span className="flex items-center gap-1 text-sm text-gray-600">
        <CircleMinus className="size-4" /> {skipped} Skipped
      </span>
      <span className="flex items-center gap-1 text-sm text-gray-600">
        <SquarePen className="size-4" /> ({attempts})
      </span>
    </div>
  </div>
  <div className="flex items-center gap-4 ml-auto">
    {/* <span className="text-2xl font-semibold text-gray-800">
      {percentage}%
    </span> */}
   <button className="bg-green-600 text-white px-4 py-2 w-full rounded-lg text-sm font-medium flex items-center justify-center gap-2">
  <View className="size-4" />
  <span>View Solutions</span>
</button>

  </div>
</div>

  );
};

export default MockTestResult;
