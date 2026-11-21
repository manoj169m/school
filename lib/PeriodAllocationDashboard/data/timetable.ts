import {
  Day,
  Standard,
  Section,
  Subject,
  TimeTablePeriod,
} from "../constants/education";

const teachers = {
  language: "Ms. Rodriguez",
  english: "Mr. Thompson",
  mathematics: "Mrs. Patel",
  science: "Dr. Wilson",
  socialScience: "Ms. Clark",
  physicalTraining: "Mr. Johnson",
  drawing: "Ms. Lee",
  computerScience: "Mr. Anderson",
  music: "Ms. Williams",
  library: "Mr. Davis",
};

const subjectSequence: Subject[] = [
  "Language",
  "English",
  "Mathematics",
  "Science",
  "Social Science",
  "Physical Training",
  "Drawing",
  "Computer Science",
  "Music",
  "Library",
];

export function generateTimetable(
  standard: Standard,
  section: Section,
  day: Day
): TimeTablePeriod[] {
  // Rotate subjects based on the day to create variety
  const dayIndex = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ].indexOf(day);
  const rotatedSubjects = [
    ...subjectSequence.slice(dayIndex),
    ...subjectSequence.slice(0, dayIndex),
  ];

  return Array.from({ length: 10 }, (_, i) => ({
    number: i + 1,
    time: [
      "8:00 - 8:45",
      "8:45 - 9:30",
      "9:30 - 10:15",
      "10:15 - 11:00",
      "11:15 - 12:00",
      "12:00 - 12:45",
      "12:45 - 1:30",
      "2:15 - 3:00",
      "3:00 - 3:45",
      "3:45 - 4:30",
    ][i],
    subject: rotatedSubjects[i],
    teacher: Object.values(teachers)[i],
    room: `${standard}-${section}-${(i + 1) * 101}`,
  }));
}
