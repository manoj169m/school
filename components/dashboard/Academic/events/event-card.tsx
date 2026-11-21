"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

interface EventCardProps {
  name: string;
  date: string;
  location: string;
  imageUrl: string;
  type: "cultural" | "sports" | "academic";
  onClick: () => void;
}

export function EventCard({
  name,
  date,
  location,
  type,
  onClick,
}: EventCardProps) {
  const gradients = {
    cultural: "from-purple-500 to-rose-500",
    sports: "from-emerald-500 to-sky-500",
    academic: "from-amber-500 to-rose-500",
  };

  // Image mapping based on event type
  const images = {
    cultural: "/assets/img/cultural.jpg",
    sports: "/assets/img/sports.jpg",
    academic: "/assets/img/academic.jpg",
  };

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden group cursor-pointer" onClick={onClick}>
        <div className="relative h-48">
          {/* Optimized image */}
          <Image
            src={images[type]}
            alt={`${type} event - ${name}`}
            layout="fill"
            objectFit="cover"
            priority
          />

          {/* Overlay gradients */}
          <div className="absolute inset-0 bg-black/40" />
          <div
            className={`absolute inset-0 bg-gradient-to-r ${gradients[type]} opacity-60`}
          />

          {/* Content */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-xl font-bold text-white mb-2 relative z-10"
            >
              {name}
            </motion.h3>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 text-white/90 text-sm relative z-10"
            >
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(date), "MMMM dd, yyyy")}</span>
            </motion.div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2 text-rose-600">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{location}</span>
          </div>

          <Button
            variant="ghost"
            className="w-full justify-between group-hover:bg-rose-50 transition-colors"
            onClick={onClick}
          >
            View Details
            <motion.div whileHover={{ x: 4 }} className="text-rose-500">
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
