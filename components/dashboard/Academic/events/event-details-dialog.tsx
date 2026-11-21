"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  FileText,
  Briefcase,
} from "lucide-react";
import Image from "next/image";

interface Event {
  id: number;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  type: "cultural" | "sports" | "academic";
  branchId: number | null;
  branchName: string | null;
  incharger: {
    name: string;
    designation: string;
    imageUrl: string;
  };
  imageUrl: string;
}

interface EventDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
}

export function EventDetailsDialog({
  isOpen,
  onClose,
  event,
}: EventDetailsDialogProps) {
  // Image mapping based on event type
  const images = {
    cultural: "/assets/img/cultural.jpg",
    sports: "/assets/img/sports.jpg",
    academic: "/assets/img/academic.jpg",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl mx-auto p-4 max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-lg custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-rose-950">
            {event.name}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6">
          <div className="relative h-48 rounded-lg overflow-hidden mb-6">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <Image
              src={images[event.type]}
              alt={`${event.type} event - ${event.name}`}
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 bg-rose-50 p-3 rounded-lg"
              >
                <Calendar className="h-5 w-5 text-rose-500" />
                <div>
                  <p className="text-sm text-rose-600">Date</p>
                  <p className="font-medium text-rose-950">
                    {format(new Date(event.date), "EEEE, MMMM dd, yyyy")}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 bg-rose-50 p-3 rounded-lg"
              >
                <Clock className="h-5 w-5 text-rose-500" />
                <div>
                  <p className="text-sm text-rose-600">Time</p>
                  <p className="font-medium text-rose-950">
                    {event.startTime} - {event.endTime}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 bg-rose-50 p-3 rounded-lg"
              >
                <MapPin className="h-5 w-5 text-rose-500" />
                <div>
                  <p className="text-sm text-rose-600">Location</p>
                  <p className="font-medium text-rose-950">{event.location}</p>
                </div>
              </motion.div>
            </div>

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-rose-50 p-4 rounded-lg"
              >
                <div className="flex items-center gap-3 mb-3">
                  <User className="h-5 w-5 text-rose-500" />
                  <h3 className="font-medium text-rose-950">Event Incharge</h3>
                </div>
                <div className="flex items-center gap-3">
                  <Image
                    src="/assets/img/incharger.jpg"
                    alt={event.incharger.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-rose-950">
                      {event.incharger.name}
                    </p>
                    <p className="text-sm text-rose-600 flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {event.incharger.designation}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-rose-50 p-4 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-rose-500" />
                  <h3 className="font-medium text-rose-950">Description</h3>
                </div>
                <p className="text-rose-600 text-sm leading-relaxed">
                  {event.description}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
