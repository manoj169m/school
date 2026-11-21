"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface CountCardProps {
  label: string;
  count: number;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  iconClass: string;
  textColor: string;
  hoverEffect: string;
  delay?: number;
}

export function CountCard({
  label,
  count,
  icon,
  gradientFrom,
  gradientVia,
  gradientTo,
  iconClass,
  textColor,
  hoverEffect,
  delay = 0,
}: CountCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
      className="h-full"
    >
      <Card 
        className={`h-full p-6 relative overflow-hidden 
        bg-gradient-to-br ${gradientFrom} ${gradientVia} ${gradientTo}
        border-none shadow-lg hover:shadow-xl transition-all duration-300 
        ${hoverEffect}`}
      >
        {/* Decorative circles */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full opacity-10 bg-white" />
        <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full opacity-5 bg-black" />
        
        <div className="relative flex items-center gap-4">
          <div className={`${iconClass} p-4 rounded-2xl shadow-lg backdrop-blur-sm`}>
            {icon}
          </div>
          <div className="flex-1">
            <p className={`text-sm font-medium ${textColor} opacity-90 mb-1`}>{label}</p>
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: delay + 0.2, 
                type: "spring", 
                stiffness: 100,
                damping: 10
              }}
              className={`text-2xl font-bold ${textColor} tracking-tight`}
            >
              {count.toLocaleString()}
            </motion.p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}