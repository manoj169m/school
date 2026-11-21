"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Cake, Briefcase, GraduationCap, CalendarDays } from "lucide-react";
import { Student, Employee, CelebrationType } from "@/types/celebrations";

interface CelebrationDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: CelebrationType;
  data: Student[] | Employee[];
}

export function CelebrationDetailsDialog({
  isOpen,
  onClose,
  type,
  data,
}: CelebrationDetailsDialogProps) {
  const getTitle = () => {
    switch (type) {
      case "student-birthday":
        return "Today's Birthday Stars 🎉";
      case "employee-birthday":
        return "Happy Birthday to Our Amazing Staff! 🎂";
      case "employee-anniversary":
        return "Work Anniversary Celebrations! 🌟";
    }
  };

  // Type guard to check if person is a Student
  const isStudent = (person: Student | Employee): person is Student => {
    return 'className' in person;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-rose-950">
            {getTitle()}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <AnimatePresence>
            {data.map((person, index) => (
              <motion.div
                key={person.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 shadow-lg border border-rose-100"
              >
                <div className="flex gap-4">
                  <div className="relative w-24 h-24">
                    <Image
                      src={person.imageUrl}
                      alt={person.name}
                      fill
                      className="rounded-full object-cover"
                    />
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      className="absolute -top-2 -right-2 bg-rose-500 rounded-full p-2"
                    >
                      {type.includes("birthday") ? (
                        <Cake className="h-4 w-4 text-white" />
                      ) : (
                        <CalendarDays className="h-4 w-4 text-white" />
                      )}
                    </motion.div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-rose-950 mb-2">
                      {person.name}
                    </h3>
                    {isStudent(person) ? (
                      <div className="space-y-2">
                        <p className="text-rose-600 flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          {person.className} - Section {person.section}
                        </p>
                        <p className="text-rose-600">
                          Roll Number: {person.rollNumber}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-rose-600 flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          {person.designation}
                        </p>
                        <p className="text-rose-600">{person.department}</p>
                        {type === "employee-anniversary" && (
                          <p className="text-rose-600">
                            {person.yearsOfService} Years of Service
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <motion.div
                  className="mt-4 p-3 bg-rose-50 rounded-md text-center"
                  animate={{
                    backgroundColor: [
                      "rgb(255, 241, 242)",
                      "rgb(254, 205, 211)",
                      "rgb(255, 241, 242)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <p className="text-rose-700 font-medium">
                    {type.includes("birthday")
                      ? `Happy ${person.age}th Birthday! 🎉`
                      : `Happy Work Anniversary! 🎊`}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}