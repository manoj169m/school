import { Day } from "../constants/education";
import { Teacher } from "../constants/teachers";
import { TIME_SLOTS, FREE_PERIOD_PATTERNS } from "../constants/schedule";

export interface TeacherPeriod {
  time: string;
  class?: string;
  subject?: string;
  room?: string;
  isFree: boolean;
}

const CLASSES = [
  "LKG-A",
  "UKG-B",
  "1st-A",
  "2nd-B",
  "3rd-C",
  "4th-A",
  "5th-B",
  "6th-C",
  "7th-A",
  "8th-B",
  "9th-C",
  "10th-A",
  "11th-B",
  "12th-C",
];

function getFreePeriods(teacherId: string, day: Day): number[] {
  const defaultFreePeriods = FREE_PERIOD_PATTERNS[day];
  const teacherNum = parseInt(teacherId);
  const offset = teacherNum % 2;

  // Return a mutable copy of the array
  return offset === 0
    ? [...defaultFreePeriods.slice(0, 1)]
    : [...defaultFreePeriods];
}

export function generateTeacherTimetable(
  teacher: Teacher,
  day: Day
): TeacherPeriod[] {
  const freePeriods = getFreePeriods(teacher.id, day);

  return TIME_SLOTS.map((time, index) => {
    const periodNumber = index + 1;
    const isFree = freePeriods.includes(periodNumber);

    if (isFree) {
      return { time, isFree: true };
    }

    const classIndex = (parseInt(teacher.id) + index) % CLASSES.length;
    const roomNumber = 100 + ((parseInt(teacher.id) * periodNumber) % 20);

    return {
      time,
      class: CLASSES[classIndex],
      subject: teacher.subject,
      room: `Room ${roomNumber}`,
      isFree: false,
    };
  });
}
