"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Exam, ExamClass } from "@/types/exam";
import { Loader2 } from "lucide-react";
import { ExamCard } from "./examCard";
import { ExamDetailsDialog } from "./examDialog";

export function UpcomingExamsSection() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedClass, setSelectedClass] = useState<ExamClass | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch("/api/exams/upcoming");
        if (!response.ok) {
          throw new Error("Failed to fetch exams");
        }
        const data = await response.json();
        setExams(data);
      } catch (error) {
        console.error("Error fetching exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const groupExamsByName = (exams: Exam[]) => {
    const grouped = exams.reduce((acc, exam) => {
      if (!acc[exam.name]) {
        acc[exam.name] = {
          name: exam.name,
          exams: [],
        };
      }
      acc[exam.name].exams.push(exam);
      return acc;
    }, {} as Record<string, { name: string; exams: Exam[] }>);

    return Object.values(grouped);
  };

  const handleClassSelect = (exam: Exam, examClass: ExamClass) => {
    setSelectedExam(exam);
    setSelectedClass(examClass);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  const groupedExams = groupExamsByName(exams);

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
        {groupedExams.map((groupedExam, index) => (
          <motion.div
            key={groupedExam.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ExamCard
              groupedExam={groupedExam}
              selectedClass={selectedClass}
              onClassSelect={handleClassSelect}
            />
          </motion.div>
        ))}
      </div>

      <ExamDetailsDialog
        isOpen={!!selectedExam && !!selectedClass}
        onClose={() => {
          setSelectedExam(null);
          setSelectedClass(null);
        }}
        selectedExam={selectedExam}
        classInfo={selectedClass}
      />
    </div>
  );
}
