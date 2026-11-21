import {
  Landmark,
  UserPlus,
  NotebookPen,
  CircleDollarSign,
  UserCog,
  MailQuestion,
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
  Bus,
  User,
  BookCopy,
  FileChartColumnIncreasing,
  MessagesSquare,
  SquareUser,
  Hotel,
} from "lucide-react";

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};

export const items = [
  {
    title: "Students",
    url: "#",
    icon: User,
    isActive: true,
    subItems: [
      {
        id: 1, // Unique ID added
        title: "Student Profile",
        url: "/process/Student/studentProfile",
      },
      {
        id: 2, // Unique ID added
        title: "List of Students",
        url: "/process/Student/listofstudents",
      },
      {
        id: 3, // Unique ID added
        title: "Dynamic Report",
        url: "/",
      },
      {
        id: 4, // Unique ID added
        title: "Certificates",
        url: "#",
      },
    ],
  },
  {
    title: "Academics",
    url: "#",
    icon: BookCopy,
    subItems: [
      {
        id: 5, // Unique ID added
        title: "Day Order",
        url: "#",
      },
      {
        id: 6, // Unique ID added
        title: "Hall Tickets",
        url: "#",
      },
      {
        id: 7, // Unique ID added
        title: "Subject wise Schedule",
        url: "#",
      },
      {
        id: 8, // Unique ID added
        title: "Analysis Report",
        url: "#",
      },
      {
        id: 9,  // Unique ID added
        title: "Result overview",
        url: "/process/Academic/result",
      },
      {
        id: 10, // Unique ID added
        title: "Result Entry",
        url: "#",
      },
      {
        id: 11, // Unique ID added
        title: "Progress Card",
        url: "#",
      },
      {
        id: 12, // Unique ID added
        title: "Time Table View",
        url: "#",
      },
      {
        id: 13, // Unique ID added
        title: "Dairy",
        url: "#",
      },
    ],
  },
  {
    title: "Finance",
    url: "#",
    icon: Landmark,
    subItems: [
      {
        id: 14, // Unique ID added
        title: "Fee Collection",
        url: "/process/Finance/incomeCollection",
      },
      {
        id: 15, // Unique ID added
        title: "Other Income",
        url: "#",
      },
      {
        id: 16, // Unique ID added
        title: "Expense Entry",
        url: "#",
      },
      {
        id: 17, // Unique ID added
        title: "Reprint Receipt",
        url: "#",
      },
      {
        id: 18, // Unique ID added
        title: "Pending Payments",
        url: "/process/Finance/pendingReport",
      },
      {
        id: 19, // Unique ID added
        title: "Daily Collection Report",
        url: "/process/Finance/collectionReport",
      },
      {
        id: 20, // Unique ID added
        title: "Monthly Report",
        url: "/process/Finance/monthlyReport",
      },
      {
        id: 21, // Unique ID added
        title: "Fee cards",
        url: "/process/Finance/feeCard",
      },
      {
        id: 75, // Unique ID added
        title: "Concession Report",
        url: "/process/Finance/concessionReport",
      },
    ],
  },
  {
    title: "Employee",
    url: "#",
    icon: SquareUser,
    subItems: [
      {
        id: 22, // Unique ID added
        title: "Individul Employee",
        url: "#",
      },
      {
        id: 23, // Unique ID added
        title: "Employee List",
        url: "#",
      },
      {
        id: 24, // Unique ID added
        title: "Employee Analysis",
        url: "#",
      },
    ],
  },
  {
    title: "Attendance",
    url: "#",
    icon: FileChartColumnIncreasing,
    subItems: [
      {
        id: 25, // Unique ID added
        title: "Attendance Report",
        url: "#",
      },
    ],
  },
  {
    title: "Communication",
    url: "#",
    icon: MessagesSquare,
    subItems: [
      {
        id: 26, // Unique ID added
        title: "Attendance SMS",
        url: "#",
      },
      {
        id: 27, // Unique ID added
        title: "Payments Pending SMS",
        url: "#",
      },
    ],
  },
  {
    title: "Transport",
    url: "#",
    icon: Bus,
    subItems: [
      {
        id: 28, // Unique ID added
        title: "Messages",
        url: "#",
      },
      {
        id: 29, // Unique ID added
        title: "Announcements",
        url: "#",
      },
    ],
  },
];


// ITEM MASTER

export const itemMaster = [
  {
    title: "Students Master",
    url: "#",
    icon: UserPlus,
    isActive: true, // Set default active status if needed
    subItems: [
      {
        id: 30, // Unique ID added
        title: "Add Student",
        url: "/master/StudentMaster/addStudent",
      },
      {
        id: 31, // Unique ID added
        title: "Student Update",
        url: "/master/StudentMaster/updateStudent",
      },
      {
        id: 32, // Unique ID added
        title: "Student Delete",
        url: "/master/StudentMaster/removeStudents",
      },
      {
        id: 33, // Unique ID added
        title: "Student Upload",
        url: "/master/StudentMaster/bulkUploadStudents",
      },
      {
        id: 34, // Unique ID added
        title: "Image Upload",
        url: "/master/StudentMaster/studentImageUpload",
      },
    ],
  },
  {
    title: "Academics Master",
    url: "#",
    icon: NotebookPen,
    subItems: [
      {
        id: 35, // Unique ID added
        title: "Exams",
        url: "/master/AcademicMaster/exam",
      },
      {
        id: 36, // Unique ID added
        title: "Add Subject",
        url: "/master/AcademicMaster/addSubject",
      },
      {
        id: 37, // Unique ID added
        title: "Class Allotment",
        url: "/master/AcademicMaster/classAllotment",
      },
      {
        id: 38, // Unique ID added
        title: "Result",
        url: "/master/AcademicMaster/resultEntry",
      },
      {
        id: 39, // Unique ID added
        title: "Add Class",
        url: "/master/AcademicMaster/addClass",
      },
      {
        id: 40, // Unique ID added
        title: "Add Section",
        url: "/master/AcademicMaster/addSection",
      },
      {
        id: 41, // Unique ID added
        title: "Period Allocation",
        url: "#",
      },
      {
        id: 42, // Unique ID added
        title: "Time Table set up",
        url: "/master/AcademicMaster/addTimetable",
      },
      {
        id: 43, // Unique ID added
        title: "Add Events",
        url: "/master/AcademicMaster/eventAllotment",
      },
      {
        id: 43, // Unique ID added
        title: "Grades",
        url: "/master/AcademicMaster/grade",
      },
    ],
  },
  {
    title: "Finance Master",
    url: "#",
    icon: CircleDollarSign,
    subItems: [
      {
        id: 44, // Unique ID added
        title: "Fee Categories",
        url: "/master/FinanceMaster/FeeCategory",
      },
      {
        id: 45, // Unique ID added
        title: "Concession Categories",
        url: "/master/FinanceMaster/concessionCategory",
      },
      {
        id: 46, // Unique ID added
        title: "Scholarship Categories",
        url: "#",
      },
      {
        id: 47, // Unique ID added
        title: "Mess Categories",
        url: "#",
      },
      {
        id: 48, // Unique ID added
        title: "Fee Synchronization",
        url: "#",
      },
      {
        id: 49, // Unique ID added
        title: "Accounts",
        url: "/master/FinanceMaster/Accounts",
      },
      {
        id: 50, // Unique ID added
        title: "Fee by class",
        url: "/master/FinanceMaster/FeeByClass",
      },
      {
        id: 51, // Unique ID added
        title: "Fee by route",
        url: "/master/FinanceMaster/FeeByRoute",
      },
      {
        id: 52, // Unique ID added
        title: "Fee by hostel",
        url: "/master/FinanceMaster/FeeByHostel",
      },
      {
        id: 53, // Unique ID added
        title: "Bank",
        url: "#",
      },
      {
        id: 54, // Unique ID added
        title: "Account Types",
        url: "#",
      },
      {
        id: 55, // Unique ID added
        title: "Approval Settings",
        url: "#",
      },
      {
        id: 56, // Unique ID added
        title: "Inc/Exp Deletion",
        url: "#",
      },
    ],
  },
  {
    title: "Employee Master",
    url: "#",
    icon: Landmark,
    subItems: [
      {
        id: 57, // Unique ID added
        title: "Add Employee",
        url: "/master/EmployeeMaster/addEmployee",
      },
      {
        id: 58, // Unique ID added
        title: "Update Employee",
        url: "/master/EmployeeMaster/updateEmployee",
      },
      {
        id: 59, // Unique ID added
        title: "Remove Employee",
        url: "/master/EmployeeMaster/removeEmployee",
      },
      {
        id: 60, // Unique ID added
        title: "Add Department",
        url: "/master/EmployeeMaster/addDepartment",
      },
      {
        id: 61, // Unique ID added
        title: "Add Designation",
        url: "/master/EmployeeMaster/addDesignation",
      },
      {
        id: 62, // Unique ID added
        title: "Employee Mapping",
        url: "#",
      },
    ],
  },
  {
    title: "Attendance Master",
    url: "#",
    icon: UserCog,
    subItems: [
      {
        id: 63, // Unique ID added
        title: "Students Attendance",
        url: "/master/AttendanceMaster/studentAttendance",
      },
      {
        id: 64, // Unique ID added
        title: "Employee Attendance",
        url: "#",
      },
    ],
  },
  {
    title: "Communication Master",
    url: "#",
    icon: MailQuestion,
    subItems: [
      {
        id: 65, // Unique ID added
        title: "Attendance SMS",
        url: "#",
      },
      {
        id: 66, // Unique ID added
        title: "Payments Pending SMS",
        url: "#",
      },
    ],
  },
  {
    title: "Transport Master",
    url: "#",
    icon: Bus,
    subItems: [
      {
        id: 67, // Unique ID added
        title: "Add Vehicles",
        url: "/master/TransportMaster/AddVehicle",
      },
      {
        id: 68, // Unique ID added
        title: "Add Route",
        url: "/master/TransportMaster/AddRoute",
      },
      {
        id: 69, // Unique ID added
        title: "Route Allocation",
        url: "#",
      },
    ],
  },
  {
    title: "Hostel Master",
    url: "#",
    icon: Hotel,
    subItems: [
      {
        id: 70, // Unique ID added
        title: "Hostel",
        url: "/master/HostelMaster/addHostel",
      },
      {
        id: 71, // Unique ID added
        title: "Rooms",
        url: "/master/HostelMaster/addRoom",
      },
      {
        id: 72, // Unique ID added
        title: "Room Allocation",
        url: "/master/HostelMaster/roomAllocation",
      },
    ],
  },
];

// USER
export const user = {
  name: "Techvation",
  email: "itsupport@rstechvation.in",
  avatar: "/avatars/shadcn.jpg",
};

export const teams = [
  {
    name: "ABC",
    logo: GalleryVerticalEnd,
    plan: "Group of Schools",
  },
  {
    name: "ABC CBSE",
    logo: AudioWaveform,
    plan: "Startup",
  },
  {
    name: "ABC Girls.",
    logo: Command,
    plan: "Free",
  },
];
