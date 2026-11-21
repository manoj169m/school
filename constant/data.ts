
export interface Event {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  branchId: string;
  incharger: {
    name: string;
    designation: string;
    imageUrl: string;
  };
  description: string;
  imageUrl: string;
  type: "cultural" | "sports" | "academic";
}

export const upcomingEvents = [
  
  {
    id: "academic",
    incharger: {
      imageUrl: "/img/incharger.jpg",
    },
    imageUrl: "/img/academic.jpg",
  },
  {
    id: "cultural",
    incharger: {
      imageUrl: "/img/incharger.jpg",
    },
    imageUrl: "/img/cultural.jpg",
  },
  {
    id: "sports",
    incharger: {
      imageUrl: "/img/incharger.jpg",
    },
    imageUrl: "/img/sports.jpg",
  },
];

export interface StudentDistribution {
  hostel: {
    total: number;
    boys: number;
    girls: number;
  };
  transport: {
    total: number;
    boys: number;
    girls: number;
    routes: number;
  };
  dayScholar: {
    total: number;
    boys: number;
    girls: number;
  };
}

export const studentDistribution: StudentDistribution = {
  hostel: {
    total: 245,
    boys: 130,
    girls: 115,
  },
  transport: {
    total: 520,
    boys: 275,
    girls: 245,
    routes: 12,
  },
  dayScholar: {
    total: 335,
    boys: 180,
    girls: 155,
  },
};

export interface Exam {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  duration: string;
  subjects: ExamSubject[];
}

export interface ExamSubject {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
}

export interface BranchWiseCount {
  id: string;
  branchId: string;
  totalStudents: number;
  boysCount: number;
  girlsCount: number;
}

export const branches: Branch[] = [
  { id: "1", name: "Main Campus", code: "MC" },
  { id: "2", name: "North Campus", code: "NC" },
  { id: "3", name: "South Campus", code: "SC" },
];

export const branchWiseCounts: BranchWiseCount[] = [
  {
    id: "1",
    branchId: "1",
    totalStudents: 1250,
    boysCount: 650,
    girlsCount: 600,
  },
  {
    id: "2",
    branchId: "2",
    totalStudents: 850,
    boysCount: 450,
    girlsCount: 400,
  },
  {
    id: "3",
    branchId: "3",
    totalStudents: 950,
    boysCount: 500,
    girlsCount: 450,
  },
];

export const upcomingExams: Exam[] = [
  {
    id: "1",
    name: "Mid-Term Examination",
    startDate: "2024-04-15",
    endDate: "2024-04-25",
    startTime: "09:00",
    endTime: "12:00",
    duration: "3 hours",
    subjects: [
      {
        id: "1",
        name: "Mathematics",
        date: "2024-04-15",
        startTime: "09:00",
        endTime: "12:00",
        duration: "3 hours",
      },
      {
        id: "2",
        name: "Science",
        date: "2024-04-17",
        startTime: "09:00",
        endTime: "12:00",
        duration: "3 hours",
      },
      {
        id: "3",
        name: "English",
        date: "2024-04-19",
        startTime: "09:00",
        endTime: "12:00",
        duration: "3 hours",
      },
    ],
  },
  {
    id: "2",
    name: "Final Practical Examination",
    startDate: "2024-05-10",
    endDate: "2024-05-15",
    startTime: "10:00",
    endTime: "16:00",
    duration: "6 hours",
    subjects: [
      {
        id: "4",
        name: "Physics Lab",
        date: "2024-05-10",
        startTime: "10:00",
        endTime: "13:00",
        duration: "3 hours",
      },
      {
        id: "5",
        name: "Chemistry Lab",
        date: "2024-05-12",
        startTime: "10:00",
        endTime: "13:00",
        duration: "3 hours",
      },
      {
        id: "6",
        name: "Biology Lab",
        date: "2024-05-15",
        startTime: "10:00",
        endTime: "13:00",
        duration: "3 hours",
      },
    ],
  },
];

export interface Person {
  id: string;
  name: string;
  imageUrl: string;
  birthDate: string;
  age: number;
}

export interface Student extends Person {
  className: string;
  section: string;
  rollNumber: string;
}

export interface Employee extends Person {
  designation: string;
  department: string;
  joiningDate: string;
  yearsOfService: number;
}

export const birthdayStudents = [
  {
    id: "boy",
    imageUrl:
      "/img/boy.jpg",
  },
  {
    id: "girl",
    imageUrl:
      "/img/girl.jpg",
  },
];

export const birthdayEmployees = [
  {
    id: "men",
    imageUrl:
      "/img/empboy.jpg",
  },
  {
    id: "women",
    imageUrl:
      "/img/empGirl.jpg",
  },
];

export const anniversaryEmployees = [
  {
    id: "2",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
  },
];

export const BranchTypes = ["School 1", "School 2", "School 3"];

export const YearTypes = ["2020-2021", "2021-2022", "2022-2023", "2023-2024"];

export const FeeByRouteTypes = ["Route No.1", "Route No.2"];

export const RouteStagesTypes = ["Stage 1", "Stage 2"];

export const accountNameTypes = ["Transport"];

export const StatusTypes = ["Active", "In-Active"];
export const payModeTypes = ["Cash", "Online"];

export const bankNameTypes = ["HDFC BANK (CANTOMENT)", "INDIAN BANK (NALLUR )"];

export const hostelTypes = ["Boys Hostel", "Girls Hostel )"];

export const accountTypes = ["Hostel Fee", "Other Fee"];

export const subjectTypes = ["Tamil", "English"];
export const periodTypes = ["1", "2","3","4","5","6","7","8","9","10"];
export const daysTypes = ["Monday","Tuesday","Wednesday","thursday","Friday","Saturday"];

export const termTypes = ["Term 1", "Term 2", "Term 3", "Term 4"];

export const StudentTypes = ["simon", "mano", "getciya"];

export const GenderTypes = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
];

export const MaritalStatusTypes = [
  { label: "Un-Married", value: "un-married" },
  { label: "Married", value: "married" },
];

export const JobTypes = [
  { label: "Part Year", value: "part_year" },
  { label: "Full Year", value: "full_year" },
];

export const TransTechTypes = [
  { label: "Using", value: "Using" },
  { label: "Not Using", value: "Not_Using" },
];

export const TransportTypes = ["Using", "NotUsing"];

export const RouteNameTypes = ["Chathram To Market", "Palakarai to junction"];

export const StopNameTypes = ["Stop 1", "Stop 2"];

export const HostelTypes = ["Using", "NotUsing"];

export const HostelNameTypes = ["Boys Hostel", "Girls Hostel"];

export const RoomTypes = ["Floor 1", "Floor 2"];

export const AccountsValues = [" General", "Transport", "Hostel"];

export const DefaultTypes = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

export const AccountsTypes = ["ASSET", "INCOME", "EXPENSE", "LIABILITY"];

export const StaffTypes = ["simon", "mano", "getciya", "karthik", "anitha"];

export const CommunicationTypes = ["SMS", "Notice"];

export const AttendanceAlertTypes = [
  "simon",
  "mano",
  "getciya",
  "karthik",
  "anitha",
];

export const ReportTypes = ["simon", "mano", "getciya", "karthik", "anitha"];

export const ClassTypes = ["LKG", "UKG", "I Class", "II Class"];

export const EvenTypes = ["cultural", "sports", "academic",];

export const SectionTypes = ["A", "B", "C", "D"];

export const DepartmentTypes = ["Tamil", "English", "Maths", "Science"];

export const StateTypes = ["Tamil Nadu", "Kerala"];

export const CountryTypes = ["India", "Canada"];

export const StudentEditTypes = ["Yes", "No"];

export const PhNoTypes = ["Yes", "No"];

export const PastFinanceTypes = ["Yes", "No"];

export const AccountNameTypes = [
  "School Fees",
  "Misc Fees",
  "Transport Fees",
  "Maintenance",
  "Stationary",
  "Book Fees",
  "Hostel Fees",
];

export const EmpTypes = [
  "Teaching",
  "Non-Teaching",
  "Technical",
  "Office",
  "Class-IV",
  "TOP Management",
  "Marketing",
];

export const EmpDepartmentTypes = [
  "Tamil",
  "English",
  "Maths",
  "Science",
  "Social",
  "Office",
];
export const EmpDesignationTypes = [
  "Chairman",
  "Principal",
  "Cashier",
  "Office Staff",
  "Teacher",
  "Driver",
];

export const CategoryTypes = ["General"];

export const BloodGroupTypes = [
  "O +ve",
  "O -ve",
  "A +ve",
  "A -ve",
  "B +ve",
  "B -ve",
  "AB +ve",
  "AB -ve",
];

export const EnquiryStatusTypes = [
  "Interested",
  "Not Interested",
  "Application",
  "Admission",
];

export const FeeTypes = ["General"];

export const TcTypes = ["issued", "Not issued"];

export interface AcademicYearOption {
  id: string;
  label: string;
}

export interface FeeCategory {
  id: number;
  category: string;
}

export interface UploadDetails {
  successful: number;
  failed: number;
  details?: {
    failed: Array<{ index: number; errors: any[] }>; // Replace `any` with the actual error structure
  };
}
