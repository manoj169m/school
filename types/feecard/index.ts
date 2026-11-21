export enum FeeGenderType {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    ALL = 'ALL'
  }
  
  export interface IAccount {
    accountName: string;
  }
  
  export interface IBranch {
    name: string;
  }
  
  export interface IClass {
    name: string;
  }
  
  export interface ISection {
    name: string;
  }
  
  export interface IFeeCategory {
    category: string;
  }
  
  export interface IAcademicYear {
    name: string;
  }
  
  export interface IFeeStructure {
    id: number;
    accountId: number;
    term: number;
    incomeType: string;
    gender: FeeGenderType;
    admissionOnly: boolean;
    daysScholarOnly: boolean;
    classId: number;
    sectionId: number;
    branchId: number;
    academicYearId: number;
    feeCategoryId: number;
    amount: number;
    createdAt: string;
    updatedAt: string;
    dueDate: string;
    account: IAccount;
    branch: IBranch;
    class: IClass;
    section: ISection;
    feeCategory: IFeeCategory;
    academicYear: IAcademicYear;
  }