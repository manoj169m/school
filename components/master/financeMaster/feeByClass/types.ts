import { FeeFormValues } from "./AddFeeDialog";

export interface AcademicYear {
    id: number;
    label: string;
  }
  
 export interface Branch {
    id: number;
    name: string;
  }
  
export  interface Class {
    id: number;
    name: string;
  }
  
export  interface Section {
    id: number;
    name: string;
  }
  
 export interface FeeCategory {
    id: number;
    category: string;
  }
  
 export interface FeeData extends FeeFormValues {
    academicYearId: number;
    branchId: number;
    classId: number;
    sectionId: number;
    feeCategoryId: number;
    accountId: number;
    
}

