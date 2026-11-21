import { useState } from 'react';

export function usePerformance() {
  const [performance] = useState([
    { name: "Academics", value: 85 },
    { name: "Sports", value: 75 },
    { name: "Extra-Curricular", value: 90 },
  ]);

  return performance;
}