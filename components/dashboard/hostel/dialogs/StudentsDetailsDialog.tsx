'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { useState } from 'react';
import StudentsList from '../students/StudentsList';
import { getStandards } from '@/lib/hostelDashboard/utils/standards';

interface StudentsDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const standards = getStandards();

export default function StudentsDetailsDialog({ open, onOpenChange }: StudentsDetailsDialogProps) {
  const [selectedStandard, setSelectedStandard] = useState<number | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white p-6">
        <DialogTitle className="text-3xl font-bold mb-6 text-center ">
          {selectedStandard === null
            ? "Select Standard"
            : `${selectedStandard}${getOrdinalSuffix(
                selectedStandard
              )} Standard Students`}
        </DialogTitle>

        {selectedStandard === null ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {standards.map((standard) => (
              <motion.div
                key={standard.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-gradient-to-r from-rose-200 to-red-300 hover:from-rose-600 hover:to-red-700 group rounded-lg p-4 cursor-pointer text-center shadow-xl`}
                onClick={() => setSelectedStandard(standard.id)}
              >
                <h3 className="text-lg font-bold  group-hover:text-white ">
                  {standard.name}
                </h3>
                <p className="text-sm opacity-80 group-hover:text-white ">
                  Click to view students
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <StudentsList
            standard={selectedStandard}
            onBack={() => setSelectedStandard(null)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function getOrdinalSuffix(i: number) {
  const j = i % 10;
  const k = i % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}