'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { TeacherSelector } from './teacher-selector';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { generateTeacherTimetable, TeacherPeriod } from '@/lib/PeriodAllocationDashboard/data/teacher-timetable';
import { Teacher } from '@/lib/PeriodAllocationDashboard/constants/teachers';
import { Day } from '@/lib/PeriodAllocationDashboard/constants/education';

export default function TeacherTimetable() {
  const [schedule, setSchedule] = useState<TeacherPeriod[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);

  const handleSelectionChange = (selection: {
    teacher: Teacher | null;
    day: Day | null;
  }) => {
    setSelectedTeacher(selection.teacher);
    setSelectedDay(selection.day);

    if (selection.teacher && selection.day) {
      const newSchedule = generateTeacherTimetable(selection.teacher, selection.day);
      setSchedule(newSchedule);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6">
        <h2 className="text-3xl font-bold mb-4">Teacher Schedule</h2>
        
        <TeacherSelector onSelectionChange={handleSelectionChange} />

        {selectedTeacher && selectedDay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4">
              <h3 className="text-xl font-semibold">
                {selectedTeacher.name} - {selectedDay}
              </h3>
              <p className="text-muted-foreground">
                Subject: {selectedTeacher.subject} | Department: {selectedTeacher.department}
              </p>
            </div>

            <ScrollArea className="h-[400px] rounded-md border">
              <div className="grid grid-cols-1 gap-4 p-4">
                {schedule.map((slot, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={cn(
                      "p-4 rounded-lg border",
                      slot.isFree ? "bg-muted" : "bg-card"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium ">{slot.time}</span>
                      <Badge variant={slot.isFree ? "secondary" : "default"}>
                        {slot.isFree ? "Free Period" : "Teaching"}
                      </Badge>
                    </div>
                    {!slot.isFree && (
                      <div className="mt-2 space-y-1 text-base">
                        <p>Class: {slot.class}</p>
                        <p>Room: {slot.room}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}