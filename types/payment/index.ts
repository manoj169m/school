export interface FormattedOption {
    value: string;
    label: string;
  }
  
  export interface APIResponse {
    academicYear: {
      id: number;
      label: string;
    }[];
    account: {
      id: number;
      accountName: string;
    }[];
    branch: {
      id: number;
      name: string;
    }[];
  }
  
  export interface Payment {
    id: number;
    receiptNumber: string;
    amount: number;
    paymentMode: string;
    collectedDate: string;
    collectedBy: string;
    term?: string;
    reference?: string;
    bankName?: string;
    studentName?: string;
    className?: string;
    sectionName?: string;
    academicYear?: string;
    branchName?: string;
    accountName?: string;
  }
  
  export interface PaymentSummary {
    totalAmount: number;
    modeWiseTotal: { [key: string]: number };
    accountWiseTotal: { [key: string]: number };
    branchWiseTotal: { [key: string]: number };
  }