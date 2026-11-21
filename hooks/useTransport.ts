import { useState } from 'react';

export function useTransport() {
  const [transport] = useState({
    buses: 15,
    routes: 12,
    totalStudents: 850,
  });

  return transport;
}