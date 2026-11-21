import { useState } from 'react';

export function useFinance() {
  const [finance] = useState({
    receivable: 2500000,
    payable: 1800000,
  });

  return finance;
}