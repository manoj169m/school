'use client';

import { motion } from 'framer-motion';
import { Award, Check, X, ArrowLeft } from 'lucide-react';

interface ExamResultsSectionProps {
  onBack: () => void;
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

export default function ExamResultsSection({ onBack }: ExamResultsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Award className="w-6 h-6 text-red-500" />
          Examination Results
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
                <p className="text-red-500 font-medium mt-1">
                  Grade: {exam.grade} | Total Score: {exam.scoredMarks}/{exam.totalMarks}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">
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
                  className="bg-red-50 rounded-lg p-4 hover:shadow-md transition-shadow"
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
    </motion.div>
  );
}