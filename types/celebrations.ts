export interface WeekDate {
    date: Date;
    dayName: string;
    dayNumber: number;
  }
  
  export interface Student {
    id: number;
    name: string;
    imageUrl: string;
    className: string;
    section: string;
    rollNumber: string;
    age: number;
  }
  
  export interface Employee {
    id: number;
    name: string;
    imageUrl: string;
    designation: string;
    department: string;
    age: number;
    yearsOfService?: number;
  }
  
  export type CelebrationType = "student-birthday" | "employee-birthday" | "employee-anniversary";
  
  export interface Celebrations {
    studentBirthdays: Student[];
    employeeBirthdays: Employee[];
    workAnniversaries: Employee[];
  }

  export interface APIStudent {
    student: {
      id: number;
      firstName: string;
      lastName: string;
      imageUrl?: string;
      rollNo?: string;
      dateOfBirth: string;
    };
    class: {
      name: string;
    };
    section: {
      name: string;
    };
  }
  
  export interface APIEmployee {
    id: number;
    firstName: string;
    lastName: string;
    imageUrl?: string;
    dateOfBirth?: string;
    dateOfJoin: string;
    designation: {
      title: string;
    };
    department: {
      name: string;
    };
  }
  
  export interface APIResponse {
    studentBirthdays: APIStudent[];
    employeeBirthdays: APIEmployee[];
    workAnniversaries: APIEmployee[];
    weekDates: APIWeekDate[];
  }
  
  export interface APIWeekDate {
    date: string;
    dayName: string;
    dayNumber: number;
  }