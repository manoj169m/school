
import { EnrolledStudent } from "../types/student";
import { hostels } from "./hostels";

export const enrolledStudents: EnrolledStudent[] = Array.from(
  { length: 30 },
  (_, i) => {
    const enrolledDate = new Date(
      2024,
      Math.floor(Math.random() * 3),
      Math.floor(Math.random() * 28)
    );
    const expectedVacateDate = new Date(enrolledDate);
    expectedVacateDate.setFullYear(expectedVacateDate.getFullYear() + 1);

    const hostel = hostels[Math.floor(Math.random() * hostels.length)];

    return {
      id: i + 1,
      name: `Student ${i + 1}`,
      class: Math.floor(Math.random() * 12) + 1,
      section: ["A", "B", "C"][Math.floor(Math.random() * 3)],
      rollNumber: `R${String(Math.floor(Math.random() * 1000)).padStart(
        3,
        "0"
      )}`,
      contactNumber: `+91${
        Math.floor(Math.random() * 9000000000) + 1000000000
      }`,
      hostelName: hostel.name,
      floor: Math.floor(Math.random() * hostel.floors) + 1,
      roomNumber: Math.floor(Math.random() * hostel.roomsPerFloor) + 1,
      enrolledDate: enrolledDate.toISOString().split("T")[0],
      expectedVacateDate: expectedVacateDate.toISOString().split("T")[0],
    };
  }
).sort(
  (a, b) =>
    new Date(b.enrolledDate).getTime() - new Date(a.enrolledDate).getTime()
);
