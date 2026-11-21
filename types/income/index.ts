export interface StudentDetails {
    name: string;
    fatherName: string;
    branch: string;
    contactNo: string;
    class: string;
    section: string;
    academicYear: string;
    phoneNo: string;
    admissionNo: string;
    rollNo: string;
  }
  
  export interface FeeData {
    studentDetails: StudentDetails;
    studentFeeId: number;   // Add this
    studentId: number;      // Add this
    enrollmentId: number;  
    academicYearId: number;
    branchId: number;
    classId: number;    
    sectionId: number; 
    regularFees: Array<{
      accountId: number;
      amount: number;
      dueDate: string;
      term: string;
      account: {
        accountName: string;
      };
    }>;
    transportFee: {
      accountId: number;
      amount: number;
      dueDate: string;
      term: string;
      account: {
        accountName: string;
      };
    } | null;
    hostelFee: {
      accountId: number;
      amount: number;
      dueDate: string;
      term: string;
      account: {
        accountName: string;
      };
    } | null;
    individualFees: Array<{
      amount: number;
      accountId: number;
      term: string;
      account: {
        accountName: string;
      };
    }>;
    concessions: Array<{
      amount: number;
      accountId: number;
      term: string;
      account: {
        accountName: string;
      };
    }>;
    payments: Array<{
      amount: number;
      accountId: number;
      term: string;
      account: {
        accountName: string;
      };
    }>;
  }
  
  export interface FeeDetail {
    accountId: number;
    accountName: string;
    term: string;
    dueDate: string;
    amount: number;
    concession: number;
    paid: number;
    pending: number;
    currentPayment: string;
  }

  export interface PaymentSubmission {
    studentFeeId: number;
    studentId: number;
    enrollmentId: number;
    branchId: number;
    academicYearId: number;
    payments: Array<{
      accountId: number;
      term: string;
      amount: number;
    }>;
    paymentDetails: {
      collectedDate: string;
      paymentMode: string;
      bankName?: string;
      reference?: string;
    };
  }