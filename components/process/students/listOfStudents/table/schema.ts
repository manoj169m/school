
export interface StudentData {
  enrollmentId: number;
  enrollmentDate: string;
  hostelStatus: string;
  transportStatus: string;
  branch: { id: number; name: string };
  class: { id: number; name: string };
  section: { id: number; name: string };
  student: {
    id: number;
    firstName: string;
    lastName: string;
    admissionNo: string;
    rollNo: string;
    email: string;
    community: string;
    caste: string;
    bloodGroup: string;
    religion: string;
    address: string;
    gender: string;
  };
  status: string;
}