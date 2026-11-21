'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExamTimetableDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const examSchedule = [
  {
    examName: 'Mid-Term Examination',
    examType: 'Internal Assessment',
    subjects: [
      { name: 'Mathematics', date: '2024-03-25', time: '09:00 AM - 12:00 PM', venue: 'Hall A' },
      { name: 'Science', date: '2024-03-27', time: '09:00 AM - 12:00 PM', venue: 'Hall B' },
      { name: 'English', date: '2024-03-29', time: '09:00 AM - 12:00 PM', venue: 'Hall A' }
    ]
  }
];

export default function ExamTimetableDialog({ isOpen, onClose }: ExamTimetableDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Calendar className="w-6 h-6 text-rose-500" />
            Examination Schedule
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-8 mt-4">
          {examSchedule.map((exam, examIndex) => (
            <motion.div
              key={examIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: examIndex * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{exam.examName}</h2>
              <p className="text-rose-500 font-medium mb-6">{exam.examType}</p>

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
                      <h3 className="text-lg font-semibold text-gray-800">{subject.name}</h3>
                      <span className="text-rose-600 font-medium">{subject.date}</span>
                    </div>
                    <div className="mt-2 flex justify-between text-sm text-gray-600">
                      <span>{subject.time}</span>
                      <span>{subject.venue}</span>
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