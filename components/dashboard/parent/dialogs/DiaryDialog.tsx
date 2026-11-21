'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Book } from 'lucide-react';
import { motion } from 'framer-motion';

interface DiaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
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

export default function DiaryDialog({ isOpen, onClose }: DiaryDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Book className="w-6 h-6 text-rose-500" />
            Daily Homework Diary
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 mt-4">
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
                  <p className="text-rose-500 font-medium mt-1">{homework.topic}</p>
                </div>
                <span className="text-sm text-gray-500">Due: {homework.dueDate}</span>
              </div>
              <p className="mt-4 text-gray-600">{homework.description}</p>
            </motion.div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}