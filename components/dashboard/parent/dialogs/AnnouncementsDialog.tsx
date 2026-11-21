'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnnouncementsDialogProps {
  isOpen: boolean;
  onClose: () => void;
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

export default function AnnouncementsDialog({ isOpen, onClose }: AnnouncementsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Bell className="w-6 h-6 text-rose-500" />
            School Announcements
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 mt-4">
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
                      <span className="px-2 py-1 bg-rose-100 text-rose-600 text-xs font-medium rounded-full">
                        Important
                      </span>
                    )}
                  </div>
                  <p className="text-rose-500 font-medium mt-1">{announcement.category}</p>
                </div>
                <span className="text-sm text-gray-500">{announcement.date}</span>
              </div>
              <p className="mt-4 text-gray-600">{announcement.description}</p>
            </motion.div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}