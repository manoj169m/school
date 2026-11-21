import { useState } from 'react';

export function useEvents() {
  const [events] = useState([
    {
      name: "Annual Sports Day",
      date: "2024-04-15",
      time: "9:00 AM",
      inCharge: "Mr. John Smith",
    },
    {
      name: "Science Exhibition",
      date: "2024-04-20",
      time: "10:00 AM",
      inCharge: "Mrs. Sarah Johnson",
    },
  ]);

  return events;
}