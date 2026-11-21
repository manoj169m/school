'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SparklesProps {
  className?: string;
  color?: 'rose' | 'gold';
}

export function Sparkles({ className, color = 'rose' }: SparklesProps) {
  const colors = {
    rose: 'text-red-600',
    gold: 'text-yellow-600'
  };

  return (
    <div className={cn('relative w-8 h-8', className)}>
      {[...Array(3)].map((_, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn('absolute w-full h-full', colors[color])}
          initial={{ scale: 0, rotate: 0 }}
          animate={{
            scale: [0, 1, 0],
            rotate: [0, 90, 180],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut'
          }}
        >
          <path
            d="M12 2L14.4 9.6H22L16.8 14.4L19.2 22L12 17.2L4.8 22L7.2 14.4L2 9.6H9.6L12 2Z"
            fill="currentColor"
          />
        </motion.svg>
      ))}
    </div>
  );
}