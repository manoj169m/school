// types/fee.ts

export interface Fee {
    id: number;
    accountId: number;
    term: number;
    incomeType: string;
    gender: string;
    admissionOnly: boolean;
    daysScholarOnly: boolean;
    dueDate: string;
    amount: number;
    classId: number;
    sectionId: number;
    branchId: number;
    academicYearId: number;
    feeCategoryId: number;
    className: string;
    sectionName: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ApiErrorResponse {
    error: string;
    duplicates?: DuplicateFeeEntry[];
    code?: string;
    details?: string;
  }
  
  export interface ApiSuccessResponse {
    success: boolean;
    message: string;
    data: Fee[];
  }
  
  export interface DuplicateFeeEntry {
    className: string;
    sectionName: string;
    term: number;
  }
  
  export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;
  
  // Update the FeeByClass fees state type
  export interface TableFee extends Fee {
    // Add any additional fields needed for the table display
    account?: {
      accountName: string;
    };
    class: {
      name: string;
    };
    section: {
      name: string;
    };
    branch: {
      name: string;
    };
    academicYear: {
      label: string;
    };
    feeCategory: {
      category: string;
    };
  }