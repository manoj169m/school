export interface Vehicle {
  id: number;
  busNo: string;
  driverName: string;
  driverContact: string;
  capacity: number;
}

export interface Student {
  id: number;
  rollNo: string;
  name: string;
  fatherContact: string;
  transportType: "pickup" | "drop" | "both" | "none";
  busNo: string;
}

export interface Section {
  id: number;
  name: string;
  students: Student[];
}

export interface ClassInfo {
  id: number;
  name: string;
  totalStudents: number;
  sections: Section[];
}