"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { GraduationCap, School } from "lucide-react";
import { Exam, ExamClass } from "@/types/exam";

interface GroupedExam {
  name: string;
  exams: Exam[];
}

interface ExamCardProps {
  groupedExam: GroupedExam;
  selectedClass: ExamClass | null;
  onClassSelect: (exam: Exam, examClass: ExamClass) => void;
}

export function ExamCard({
  groupedExam,
  selectedClass,
  onClassSelect,
}: ExamCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-rose-500 to-rose-400 p-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <GraduationCap className="h-6 w-6 text-white" />
          <h3 className="text-lg font-semibold text-white">
            {groupedExam.name}
          </h3>
        </motion.div>
      </div>

      <div className="p-4 space-y-4">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <School className="h-6 w-6 text-rose-500" />
          <div>
            <p className="text-base text-rose-700">Available Classes</p>
            <p className="font-medium text-sm text-rose-950">
              Click a class to view exam details
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {groupedExam.exams.map((exam) =>
            exam.classes.map((examClass, index) => (
              <motion.div
                key={`${exam.id}-${examClass.id}-${examClass.section}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <Button
                  variant={
                    selectedClass?.id === examClass.id &&
                    selectedClass?.section === examClass.section
                      ? "default"
                      : "outline"
                  }
                  className="w-full"
                  onClick={() => onClassSelect(exam, examClass)}
                >
                  {examClass.name} - {examClass.section}
                </Button>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}
