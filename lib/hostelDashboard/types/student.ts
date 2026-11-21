export interface EnrolledStudent {
  id: number;
  name: string;
  class: number;
  section: string;
  rollNumber: string;
  contactNumber: string;
  hostelName: string;
  floor: number;
  roomNumber: number;
  enrolledDate: string;
  expectedVacateDate: string;
}

export interface VacatedStudent {
  id: number;
  name: string;
  class: number;
  section: string;
  rollNumber: string;
  contactNumber: string;
  lastFloor: number;
  lastRoomNumber: number;
  hostelName: string;
  enrolledDate: string;
  vacatedDate: string;
}
