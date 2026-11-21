'use client';

import { motion } from 'framer-motion';
import { Book, ArrowLeft } from 'lucide-react';

interface DiarySectionProps {
  onBack: () => void;
}

const homeworkData = [
  {
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    description: 'Complete exercises 5.1 to 5.3 from the textbook. Practice solving word problems.',
    dueDate: '2024-03-20',
  },
  {
    subject: 'Science',
    topic: 'Chemical Reactions',
    description: 'Read chapter 3 and prepare notes on types of chemical reactions.',
    dueDate: '2024-03-21',
  }
];

export default function DiarySection({ onBack }: DiarySectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Book className="w-6 h-6 text-red-500" />
          Daily Homework Diary
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

      <div className="grid gap-6">
        {homeworkData.map((homework, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{homework.subject}</h3>
                <p className="text-red-500 font-medium mt-1">{homework.topic}</p>
              </div>
              <span className="text-sm text-gray-500">Due: {homework.dueDate}</span>
            </div>
            <p className="mt-4 text-gray-600">{homework.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}