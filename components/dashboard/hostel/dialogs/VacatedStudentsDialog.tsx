"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar, Phone, Hash, DoorOpen, Building2 } from "lucide-react";
import { vacatedStudents } from "@/lib/hostelDashboard/data/vacatedStudents";

interface VacatedStudentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VacatedStudentsDialog({
  open,
  onOpenChange,
}: VacatedStudentsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-50 p-6">
        <DialogTitle className="text-3xl font-bold mb-6 text-center text-slate-800">
          Recently Vacated Students
        </DialogTitle>

        <div className="space-y-4">
          {vacatedStudents.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-r from-rose-100 to-pink-100 rounded-xl p-4 hover:from-rose-200 hover:to-pink-200 transition-colors shadow-md"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-rose-900">
                    {student.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-rose-700">
                    <Hash className="h-4 w-4" />
                    <span>Roll No: {student.rollNumber}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-rose-700">
                    <Phone className="h-4 w-4" />
                    <span>{student.contactNumber}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-rose-700">
                    <Building2 className="h-4 w-4" />
                    <span>{student.hostelName}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-rose-700">
                      Class: {student.class} - {student.section}
                    </span>
                    <div className="flex items-center space-x-2 text-rose-700">
                      <DoorOpen className="h-4 w-4" />
                      <span>
                        Room {student.lastRoomNumber}, Floor {student.lastFloor}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-emerald-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Enrolled:{" "}
                      {format(new Date(student.enrolledDate), "MMM dd, yyyy")}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-rose-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Vacated:{" "}
                      {format(new Date(student.vacatedDate), "MMM dd, yyyy")}
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
