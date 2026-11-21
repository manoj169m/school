'use client';

import { motion } from 'framer-motion';
import { Calendar, ArrowLeft } from 'lucide-react';

interface ExamTimetableSectionProps {
  onBack: () => void;
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

export default function ExamTimetableSection({ onBack }: ExamTimetableSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-red-500" />
          Examination Schedule
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </motion.button>
      </div>

      <div className="grid gap-8">
        {examSchedule.map((exam, examIndex) => (
          <motion.div
            key={examIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: examIndex * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{exam.examName}</h2>
            <p className="text-red-500 font-medium mb-6">{exam.examType}</p>

            <div className="grid gap-4">
              {exam.subjects.map((subject, subjectIndex) => (
                <motion.div
                  key={subjectIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (examIndex * 0.1) + (subjectIndex * 0.05) }}
                  className="bg-red-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">{subject.name}</h3>
                    <span className="text-red-600 font-medium">{subject.date}</span>
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
    </motion.div>
  );
}