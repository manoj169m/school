import { useState } from 'react';

export function useAttendance() {
  const [attendance] = useState({
    students: {
      present: 1150,
      absent: 50,
      leave: 30,
      od: 20,
    },
    staff: {
      present: 95,
      absent: 3,
      leave: 1,
      od: 1,
    },
  });

  return attendance;
}