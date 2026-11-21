'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar, Phone, Hash, DoorOpen, Building2 } from 'lucide-react';
import { enrolledStudents } from '@/lib/hostelDashboard/data/enrolledStudents';

interface EnrolledStudentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EnrolledStudentsDialog({ open, onOpenChange }: EnrolledStudentsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white  p-6">
        <DialogTitle className="text-3xl  text-slate-800 font-bold mb-6 text-center">
          Recently Enrolled Students
        </DialogTitle>

        <div className="space-y-4">
          {enrolledStudents.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-r from-teal-800 to-emerald-800 rounded-lg p-4 hover:from-teal-900 hover:to-emerald-900 transition-colors"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-orange-200">
                    {student.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Hash className="h-4 w-4" />
                    <span>Roll No: {student.rollNumber}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Phone className="h-4 w-4" />
                    <span>{student.contactNumber}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Building2 className="h-4 w-4" />
                    <span>{student.hostelName}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">
                      Class: {student.class} - {student.section}
                    </span>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <DoorOpen className="h-4 w-4" />
                      <span>
                        Room {student.roomNumber}, Floor {student.floor}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-emerald-400">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Enrolled:{" "}
                      {format(new Date(student.enrolledDate), "MMM dd, yyyy")}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-red-300">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Expected Vacate:{" "}
                      {format(
                        new Date(student.expectedVacateDate),
                        "MMM dd, yyyy"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}