// types/account.ts

export enum AccountType {
    INCOME = "INCOME",
    EXPENSE = "EXPENSE",
    ASSET = "ASSET",
    LIABILITY = "LIABILITY"
  }
  
  export enum ApplicableCategory {
    ACADEMIC = "ACADEMIC",
    HOSTEL = "HOSTEL",
    TRANSPORT = "TRANSPORT"
  }
  
  export interface Account {
    id: number;
    accountName: string;
    accountType: AccountType;
    description?: string;
    openingBalance: number;
    createdAt: Date;
    updatedAt: Date;
    applicableFor: ApplicableCategory;
  }