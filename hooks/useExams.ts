import { useState } from 'react';

export function useExams() {
  const [exams] = useState([
    {
      name: "Mid-Term Mathematics",
      date: "2024-04-18",
      time: "9:30 AM",
    },
    {
      name: "Science Quarterly",
      date: "2024-04-22",
      time: "10:00 AM",
    },
  ]);

  return exams;
}