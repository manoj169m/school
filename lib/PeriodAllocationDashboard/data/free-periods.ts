import { Day } from '../constants/education';
import {  TEACHERS } from '../constants/teachers';
import { TIME_SLOTS, FREE_PERIOD_PATTERNS } from '../constants/schedule';

export interface TeacherFreePeriod {
  teacherId: string;
  teacherName: string;
  subject: string;
  department: string;
  periods: string[];
}

export function getTeacherFreePeriodsByDay(day: Day): TeacherFreePeriod[] {
  return TEACHERS.map(teacher => {
    const teacherNum = parseInt(teacher.id);
    const defaultFreePeriods = FREE_PERIOD_PATTERNS[day];
    const freePeriodIndices = teacherNum % 2 === 0 
      ? [defaultFreePeriods[0]] 
      : defaultFreePeriods;

    return {
      teacherId: teacher.id,
      teacherName: teacher.name,
      subject: teacher.subject,
      department: teacher.department,
      periods: freePeriodIndices.map(index => TIME_SLOTS[index - 1])
    };
  });
}