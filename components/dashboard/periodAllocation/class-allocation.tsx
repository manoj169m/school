"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { ClassSelector } from "./class-selector";
import { Day, Section, Standard, TimeTablePeriod } from "@/lib/PeriodAllocationDashboard/constants/education";
import { generateTimetable } from "@/lib/PeriodAllocationDashboard/data/timetable";

export default function ClassAllocation() {
  const [timetable, setTimetable] = useState<TimeTablePeriod[]>([]);
  const [selectedClass, setSelectedClass] = useState<{
    standard: Standard | null;
    section: Section | null;
    day: Day | null;
  }>({
    standard: null,
    section: null,
    day: null,
  });

  const handleSelectionChange = (selection: {
    standard: Standard | null;
    section: Section | null;
    day: Day | null;
  }) => {
    setSelectedClass(selection);
    if (selection.standard && selection.section && selection.day) {
      const newTimetable = generateTimetable(
        selection.standard,
        selection.section,
        selection.day
      );
      setTimetable(newTimetable);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 ">
        <h2 className="text-3xl font-bold mb-4">Class Timetable</h2>

        <ClassSelector onSelectionChange={handleSelectionChange} />

        {selectedClass.standard &&
          selectedClass.section &&
          selectedClass.day && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-4">
                {selectedClass.standard} Standard - Section{" "}
                {selectedClass.section} ({selectedClass.day})
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-lg">Period</TableHead>
                    <TableHead className="text-lg">Time</TableHead>
                    <TableHead className="text-lg">Subject</TableHead>
                    <TableHead className="text-lg">Teacher</TableHead>
                    <TableHead className="text-lg">Room</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timetable.map((period) => (
                    <TableRow key={period.number}>
                      <TableCell>{period.number}</TableCell>
                      <TableCell>{period.time}</TableCell>
                      <TableCell>{period.subject}</TableCell>
                      <TableCell>{period.teacher}</TableCell>
                      <TableCell>{period.room}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          )}
      </Card>
    </motion.div>
  );
}
