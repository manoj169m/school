import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Cake, PartyPopper, CalendarDays } from "lucide-react";

interface CelebrationCardProps {
  title: string;
  count: number;
  type: "birthday" | "anniversary";
  onClick: () => void;
}

export function CelebrationCard({
  title,
  count,
  type,
  onClick,
}: CelebrationCardProps) {
  const icons = {
    birthday: Cake,
    anniversary: CalendarDays,
  };

  const Icon = icons[type];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <Card className="p-6 cursor-pointer bg-gradient-to-br from-rose-100 to-white border-rose-200 hover:border-rose-300">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-rose-600">
              {title}
            </h3>
            <p className="text-slate-900">Today&apos;s Celebrations: {count}</p>
          </div>
          <div className="relative">
            <Icon className="h-12 w-12 text-rose-300" />
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-1 -right-1"
            >
              <PartyPopper className="h-6 w-6 text-rose-400" />
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
