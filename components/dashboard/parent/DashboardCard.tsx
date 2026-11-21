'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  onClick: () => void;
  delay: number;
  color: string;
}

export default function DashboardCard({ title, icon: Icon, onClick, delay,  }: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`bg-custom-pink-100 cursor-pointer rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <Icon className="w-12 h-12 text-red-600" />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
    </motion.div>
  );
}