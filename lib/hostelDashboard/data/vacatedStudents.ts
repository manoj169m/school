
import { VacatedStudent } from "../types/student";
import { hostels } from "./hostels";

export const vacatedStudents: VacatedStudent[] = Array.from(
  { length: 30 },
  (_, i) => {
    const enrolledDate = new Date(
      2023,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28)
    );
    const vacatedDate = new Date(
      2024,
      Math.floor(Math.random() * 3),
      Math.floor(Math.random() * 28)
    );
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
      lastFloor: Math.floor(Math.random() * 4) + 1,
      lastRoomNumber: Math.floor(Math.random() * 15) + 1,
      hostelName: hostel.name,
      enrolledDate: enrolledDate.toISOString().split("T")[0],
      vacatedDate: vacatedDate.toISOString().split("T")[0],
    };
  }
).sort(
  (a, b) =>
    new Date(b.vacatedDate).getTime() - new Date(a.vacatedDate).getTime()
);
