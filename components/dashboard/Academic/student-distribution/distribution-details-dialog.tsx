"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Users, UserRound, UserSquare, Bus, Home, GraduationCap } from "lucide-react";

interface DistributionDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: "hostel" | "transport" | "dayScholar";
  data: {
    total: number;
    boys: number;
    girls: number;
    routes?: number;
  };
}

export function DistributionDetailsDialog({
  isOpen,
  onClose,
  type,
  data,
}: DistributionDetailsDialogProps) {
  const getIcon = () => {
    switch (type) {
      case "hostel":
        return Home;
      case "transport":
        return Bus;
      case "dayScholar":
        return GraduationCap;
    }
  };

  const Icon = getIcon();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-rose-950 flex items-center gap-2">
            <Icon className="h-6 w-6 text-rose-500" />
            {type === "hostel"
              ? "Hostel Students"
              : type === "transport"
              ? "Transport Students"
              : "Day Scholars"}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-rose-50 p-6 rounded-lg border border-rose-100"
          >
            <div className="flex items-center gap-4 mb-6">
              <Users className="h-8 w-8 text-rose-500" />
              <div>
                <h3 className="text-lg font-semibold text-rose-950">
                  Total Students
                </h3>
                <p className="text-3xl font-bold text-rose-500">
                  {data.total}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-4 rounded-lg border border-blue-100"
              >
                <div className="flex items-center gap-3">
                  <UserSquare className="h-6 w-6 text-blue-500" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-700">Boys</h4>
                    <p className="text-2xl font-bold text-blue-950">
                      {data.boys}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-4 rounded-lg border border-pink-100"
              >
                <div className="flex items-center gap-3">
                  <UserRound className="h-6 w-6 text-pink-500" />
                  <div>
                    <h4 className="text-sm font-medium text-pink-700">Girls</h4>
                    <p className="text-2xl font-bold text-pink-950">
                      {data.girls}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {type === "transport" && data.routes && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4 bg-white p-4 rounded-lg border border-rose-100"
              >
                <div className="flex items-center gap-3">
                  <Bus className="h-6 w-6 text-rose-500" />
                  <div>
                    <h4 className="text-sm font-medium text-rose-700">
                      Active Routes
                    </h4>
                    <p className="text-2xl font-bold text-rose-950">
                      {data.routes}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}