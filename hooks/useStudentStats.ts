import { useState, useEffect } from 'react';

export function useStudentStats() {
  const [stats, setStats] = useState({
    total: 1250,
    enquiry: 180,
    admitted: 1050,
    dropout: 20,
  });

  return stats;
}