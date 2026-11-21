'use client';

import { motion } from 'framer-motion';
import { Bell, ArrowLeft } from 'lucide-react';

interface AnnouncementsSectionProps {
  onBack: () => void;
}

const announcements = [
  {
    title: 'Annual Sports Day',
    date: '2024-03-25',
    category: 'Event',
    description: 'Annual Sports Day will be held next week. All students must participate in at least one event.',
    important: true,
  },
  {
    title: 'Parent-Teacher Meeting',
    date: '2024-03-30',
    category: 'Meeting',
    description: 'Quarterly parent-teacher meeting scheduled for all classes.',
    important: true,
  }
];

export default function AnnouncementsSection({ onBack }: AnnouncementsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Bell className="w-6 h-6 text-red-500" />
          School Announcements
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
        {announcements.map((announcement, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-800">{announcement.title}</h3>
                  {announcement.important && (
                    <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                      Important
                    </span>
                  )}
                </div>
                <p className="text-red-500 font-medium mt-1">{announcement.category}</p>
              </div>
              <span className="text-sm text-gray-500">{announcement.date}</span>
            </div>
            <p className="mt-4 text-gray-600">{announcement.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}