export * from "./vehicles";
export * from "./classes";

import { countTransportStudents } from "../utils/transport-utils";
import { classes } from "./classes";

export function getTotalStudentsUsingTransport(): number {
  return classes.reduce((total, classInfo) => {
    return total + classInfo.sections.reduce((sectionTotal, section) => {
      return sectionTotal + countTransportStudents(section.students);
    }, 0);
  }, 0);
}