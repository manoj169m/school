export interface Payment {
    studentName: string;
    branchName: string;
    className: string;
    sectionName: string;
    accountName: string;
    collectedBy: string;
    collectedDate: string;
    amount: number;
    paymentMode: 'Cash' | 'Online';
  }
  
  // src/types/reports.ts
  export interface BranchBreakdown {
    [branch: string]: number;
  }
  
  export interface MonthlyTrend {
    [month: string]: number;
  }
  
  export interface BranchSummary {
    total: number;
    cashTotal: number;
    onlineTotal: number;
    studentCount: number;
    accountBreakdown: Record<string, number>;
  }
  
  export interface ClassSummary {
    branch: string;
    class: string;
    total: number;
    studentCount: number;
    sectionBreakdown: {
      [section: string]: {
        total: number;
        students: number;
      }
    }
  }
  
  export interface AccountSummary {
    total: number;
    cashTotal: number;
    onlineTotal: number;
    studentCount: number;
    branchBreakdown: BranchBreakdown;
    monthlyTrend: MonthlyTrend;
  }
  
  export interface CollectorSummary {
    total: number;
    cashTotal: number;
    onlineTotal: number;
    transactionCount: number;
    branchWise: {
      [branch: string]: {
        total: number;
        transactions: number;
      };
    };
    dailyAverage: number;
  }
  
  export interface BranchMatrix {
    total: number;
    accounts: {
      [account: string]: {
        total: number;
        modes: {
          cash: number;
          online: number;
        };
        studentCount: number;
      };
    };
  }

  export interface PaymentTrend {
    total: number;
    cash: number;
    online: number;
    transactions: number;
  }

  