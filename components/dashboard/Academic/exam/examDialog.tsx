// components/ExamDetailsDialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Calendar, Clock, BookOpen, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Exam, ExamClass } from "@/types/exam";

interface ExamDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedExam: Exam | null;
  classInfo: ExamClass | null;
}

export function ExamDetailsDialog({
  isOpen,
  onClose,
  selectedExam,
  classInfo,
}: ExamDetailsDialogProps) {
  const [loading] = useState(false);

  if (!isOpen || !selectedExam || !classInfo) {
    return null;
  }

  const subjects = selectedExam.subjects;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
          </div>
        ) : (
          <>
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="text-2xl font-bold text-rose-950">
                {selectedExam.name} - {classInfo.name} {classInfo.section}
              </DialogTitle>
            </DialogHeader>

            <ScrollArea className="p-6 pt-2 max-h-[calc(90vh-8rem)]">
              <div className="flex flex-wrap gap-4 mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-full"
                >
                  <Calendar className="h-4 w-4 text-rose-500" />
                  <span className="text-sm text-rose-700">
                    {format(new Date(selectedExam.startDate), "MMM dd")} -{" "}
                    {format(new Date(selectedExam.endDate), "MMM dd, yyyy")}
                  </span>
                </motion.div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-rose-950 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-rose-500" />
                  Subject Schedule
                </h3>

                <div className="grid gap-4">
                  <AnimatePresence>
                    {subjects.map((subject, index) => (
                      <motion.div
                        key={subject.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-4 rounded-lg border border-rose-200 hover:border-rose-300 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <h4 className="text-lg font-medium text-rose-950">
                              {subject.name}
                            </h4>
                            <p className="text-rose-600">
                              {format(
                                new Date(subject.date),
                                "EEEE, MMMM dd, yyyy"
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="flex items-center gap-1 bg-rose-50 px-3 py-1 rounded-full text-rose-700">
                              <Clock className="h-4 w-4" />
                              {subject.startTime} - {subject.endTime}
                            </span>
                            <span className="bg-rose-100 px-3 py-1 rounded-full text-rose-700">
                              {subject.duration}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
