'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Award, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExamResultsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const examResults = [
  {
    examName: 'Mid-Term Examination',
    totalMarks: 500,
    scoredMarks: 425,
    grade: 'A',
    subjects: [
      { name: 'Mathematics', maxMarks: 100, scored: 92, status: 'pass' },
      { name: 'Science', maxMarks: 100, scored: 88, status: 'pass' },
      { name: 'English', maxMarks: 100, scored: 85, status: 'pass' },
      { name: 'Social Studies', maxMarks: 100, scored: 78, status: 'pass' },
      { name: 'Language', maxMarks: 100, scored: 82, status: 'pass' }
    ]
  }
];

export default function ExamResultsDialog({ isOpen, onClose }: ExamResultsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Award className="w-6 h-6 text-rose-500" />
            Examination Results
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-8 mt-4">
          {examResults.map((exam, examIndex) => (
            <motion.div
              key={examIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: examIndex * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{exam.examName}</h2>
                  <p className="text-rose-500 font-medium mt-1">
                    Grade: {exam.grade} | Total Score: {exam.scoredMarks}/{exam.totalMarks}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-rose-600">
                    {((exam.scoredMarks / exam.totalMarks) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                {exam.subjects.map((subject, subjectIndex) => (
                  <motion.div
                    key={subjectIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (examIndex * 0.1) + (subjectIndex * 0.05) }}
                    className="bg-rose-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-800">{subject.name}</h3>
                        {subject.status === 'pass' ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <X className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600">{subject.scored}/{subject.maxMarks}</span>
                        <span className={`font-medium ${
                          subject.status === 'pass' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {((subject.scored / subject.maxMarks) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}