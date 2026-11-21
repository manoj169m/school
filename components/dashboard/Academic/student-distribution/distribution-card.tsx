"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface DistributionCardProps {
  title: string;
  icon: LucideIcon;
  total: number;
  boys: number;
  girls: number;
  extraInfo?: { label: string; value: number };
  onClick: () => void;
  gradient: string;
}

export function DistributionCard({
  title,
  icon: Icon,
  total,
  boys,
  girls,
  extraInfo,
  onClick,
  gradient,
}: DistributionCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <Card className={`p-6 cursor-pointer ${gradient} border-rose-200 hover:border-rose-300`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-rose-950">{title}</h3>
          <motion.div
            whileHover={{ rotate: 15 }}
            className="bg-white/30 p-2 rounded-lg"
          >
            <Icon className="h-6 w-6 text-rose-700" />
          </motion.div>
        </div>

        <div className="space-y-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8 }}
            className="bg-white/50 p-3 rounded-lg"
          >
            <div className="flex justify-between items-center">
              <span className="text-rose-700">Total Students</span>
              <span className="text-rose-950 font-bold">{total}</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-50/50 p-3 rounded-lg"
            >
              <div className="flex justify-between items-center">
                <span className="text-blue-700">Boys</span>
                <span className="text-blue-950 font-bold">{boys}</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-pink-50/50 p-3 rounded-lg"
            >
              <div className="flex justify-between items-center">
                <span className="text-pink-700">Girls</span>
                <span className="text-pink-950 font-bold">{girls}</span>
              </div>
            </motion.div>
          </div>

          {extraInfo && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white/50 p-3 rounded-lg"
            >
              <div className="flex justify-between items-center">
                <span className="text-rose-700">{extraInfo.label}</span>
                <span className="text-rose-950 font-bold">{extraInfo.value}</span>
              </div>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}