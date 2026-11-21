export const formatCurrency = (amount: number): string => 
    `₹${amount.toLocaleString('en-IN')}`;