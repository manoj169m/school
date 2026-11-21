"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface CountCardProps {
  label: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  delay?: number;
}

export function CountCard({
  label,
  count,
  icon,
  color,
  delay = 0,
}: CountCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className={`p-2 ${color}`}>
        <div className="flex items-center gap-4">
          <div className="bg-white/30 p-3 rounded-lg">{icon}</div>
          <div>
            <p className="text-sm font-medium text-rose-700/90">{label}</p>
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.2, type: "spring" }}
              className="text-xl font-bold text-rose-950"
            >
              {count.toLocaleString()}
            </motion.p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
