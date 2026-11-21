// types/payment.ts
export interface AcademicYear {
    id: number;
    label: string;
    startDate: string;
    endDate: string;
  }
  
  export interface Branch {
    id: number;
    name: string;
    acronym: string;
  }
  
  export interface PaymentMode {
    amount: number;
    count: number;
  }
  
  export interface BranchWiseStats {
    amount: number;
    count: number;
  }
  
  export interface DailyCollection {
    date: string;
    amount: number;
    transactions: number;
    branchWise?: Record<string, BranchWiseStats>; // Added this line
  }
  
  export interface PaymentRecord {
    id: number;
    receiptNumber: string;
    collectedDate: string;
    studentId: number;
    studentName: string;
    amount: number;
    paymentMode: string;
    accountName: string;
    collectedBy: string;
    branchName: string; // Added this line
  }
  
  export interface PeakCollection {
    date: string;
    amount: number;
  }
  
  export interface WeekdayPattern {
    [key: number]: number;
  }
  
  export interface DateRange {
    startDate: string;
    endDate: string;
    academicYear: {
      startDate: string;
      endDate: string;
    };
  }
  
  export interface PaymentStatistics {
    totalTransactions: number;
    averageTransactionValue: number;
    peakCollections: PeakCollection[];
    weekdayPatterns: WeekdayPattern;
    branchWise?: Record<string, BranchWiseStats>;
  }
  
  export interface PaymentReportData {
    totalAmount: number;
    paymentModes: {
      [key: string]: PaymentMode;
    };
    dailyCollections: DailyCollection[];
    accountBreakdown: {
      [key: string]: number;
    };
    statistics: PaymentStatistics;
    payments: PaymentRecord[];
    dateRange: DateRange;
  }