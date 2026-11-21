"use client";

import { Building2, Users, DoorOpen, UserMinus, UserPlus } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import HostelDetailsDialog from "./dialogs/HostelDetailsDialog";
import StudentsDetailsDialog from "./dialogs/StudentsDetailsDialog";
import RoomsDetailsDialog from "./dialogs/RoomsDetailsDialog";
import VacatedStudentsDialog from "./dialogs/VacatedStudentsDialog";
import EnrolledStudentsDialog from "./dialogs/EnrolledStudentsDialog";
import { Card } from "@/components/ui/card";
import ParticlesOverlay from "../overall/particles";

export default function HostelDashboard() {
  const [showHostelDetails, setShowHostelDetails] = useState(false);
  const [showStudentsDetails, setShowStudentsDetails] = useState(false);
  const [showRoomsDetails, setShowRoomsDetails] = useState(false);
  const [showVacatedStudents, setShowVacatedStudents] = useState(false);
  const [showEnrolledStudents, setShowEnrolledStudents] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-slate-100 p-8">
      <div className=" mx-auto space-y-12">
        <div className="text-center space-y-6">
          
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-red-400 backdrop-blur-sm rounded-lg p-6 shadow-lg"
            >
              <ParticlesOverlay />
              <h1 className="text-5xl font-bold text-white mb-2">
                Hostel Management Dashboard
              </h1>
              <p className="text-white ">Manage and view hostel details</p>
            </motion.div>
          
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Card
              onClick={() => setShowHostelDetails(true)}
              className="relative p-10 cursor-pointer overflow-hidden bg-gradient-to-br from-purple-100 via-purple-200 to-violet-200 hover:from-purple-500 hover:via-purple-600 hover:to-violet-700 transition-all duration-500 group shadow-lg hover:shadow-purple-500/25"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transform rotate-45 group-hover:scale-150 transition-transform duration-500" />
              <div className="flex items-center space-x-4 relative z-10">
                <Building2 className="mr-5 h-16 w-16 text-violet-800 group-hover:text-white transition-colors duration-300" />
                <div>
                  <h2 className="text-3xl font-bold text-violet-900 group-hover:text-white transition-colors duration-300">
                    Hostels Overview
                  </h2>
                  <p className="text-purple-800 group-hover:text-purple-100 transition-colors duration-300">
                    4 Active Hostels
                  </p>
                  <p className=" group-hover:text-white/80 transition-colors duration-300">
                    Click to view details →
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Card
              onClick={() => setShowStudentsDetails(true)}
              className="relative p-10 cursor-pointer overflow-hidden bg-gradient-to-br from-sky-100 via-sky-200 to-cyan-200 hover:from-sky-500 hover:via-sky-600 hover:to-cyan-700 transition-all duration-500 group shadow-lg hover:shadow-sky-500/25"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transform rotate-45 group-hover:scale-150 transition-transform duration-500" />
              <div className="flex items-center space-x-4 relative z-10">
                <Users className=" mr-5 h-16 w-16 text-cyan-800 group-hover:text-white transition-colors duration-300" />
                <div>
                  <h2 className="text-3xl font-bold text-cyan-900 group-hover:text-white transition-colors duration-300">
                    Students Overview
                  </h2>
                  <p className="text-sky-800 group-hover:text-sky-100 transition-colors duration-300">
                    480 Students
                  </p>
                  <p className=" group-hover:text-white/80 transition-colors duration-300">
                    Click to view details →
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Card
              onClick={() => setShowRoomsDetails(true)}
              className="relative p-10 cursor-pointer overflow-hidden bg-gradient-to-br from-zinc-100 via-zinc-200 to-stone-200 hover:from-zinc-500 hover:via-zinc-600 hover:to-stone-700 transition-all duration-500 group shadow-lg hover:shadow-zinc-500/25"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transform rotate-45 group-hover:scale-150 transition-transform duration-500" />
              <div className="flex items-center space-x-4 relative z-10">
                <DoorOpen className="mr-5 h-16 w-16 text-stone-800 group-hover:text-white transition-colors duration-300" />
                <div>
                  <h2 className="text-3xl font-bold text-stone-900 group-hover:text-white transition-colors duration-300">
                    Rooms Overview
                  </h2>
                  <p className="text-zinc-800 group-hover:text-zinc-100 transition-colors duration-300">
                    Here the Room Status
                  </p>
                  <p className=" group-hover:text-white/80 transition-colors duration-300">
                    Click to view details →
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Card
              onClick={() => setShowEnrolledStudents(true)}
              className="relative p-10 cursor-pointer overflow-hidden bg-gradient-to-br from-teal-100 via-teal-200 to-emerald-200 hover:from-teal-500 hover:via-teal-600 hover:to-emerald-700 transition-all duration-500 group shadow-lg hover:shadow-teal-500/25"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transform rotate-45 group-hover:scale-150 transition-transform duration-500" />
              <div className="flex items-center space-x-4 relative z-10">
                <UserPlus className="mr-5 h-16 w-16 text-emerald-800 group-hover:text-white transition-colors duration-300" />
                <div>
                  <h2 className="text-3xl font-bold text-emerald-900 group-hover:text-white transition-colors duration-300">
                    New Students
                  </h2>
                  <p className="text-teal-800 group-hover:text-teal-100 transition-colors duration-300">
                    Recent Enrollments
                  </p>
                  <p className=" group-hover:text-white/80 transition-colors duration-300">
                    Click to view details →
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Card
              onClick={() => setShowVacatedStudents(true)}
              className="relative p-10 cursor-pointer overflow-hidden bg-gradient-to-br from-red-100 via-red-200 to-rose-200 hover:from-red-500 hover:via-red-600 hover:to-rose-700 transition-all duration-500 group shadow-lg hover:shadow-red-500/25"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transform rotate-45 group-hover:scale-150 transition-transform duration-500" />
              <div className="flex items-center space-x-4 relative z-10">
                <UserMinus className=" mr-5 h-16 w-16 text-red-800 group-hover:text-white transition-colors duration-300" />
                <div>
                  <h2 className="text-3xl font-bold text-red-900 group-hover:text-white transition-colors duration-300">
                    Vacated Students
                  </h2>
                  <p className="text-rose-800 group-hover:text-rose-100 transition-colors duration-300">
                    Last 30 Days
                  </p>
                  <p className=" group-hover:text-white/80 transition-colors duration-300">
                    Click to view details →
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <HostelDetailsDialog
          open={showHostelDetails}
          onOpenChange={setShowHostelDetails}
        />
        <StudentsDetailsDialog
          open={showStudentsDetails}
          onOpenChange={setShowStudentsDetails}
        />
        <RoomsDetailsDialog
          open={showRoomsDetails}
          onOpenChange={setShowRoomsDetails}
        />
        <VacatedStudentsDialog
          open={showVacatedStudents}
          onOpenChange={setShowVacatedStudents}
        />
        <EnrolledStudentsDialog
          open={showEnrolledStudents}
          onOpenChange={setShowEnrolledStudents}
        />
      </div>
    </div>
  );
}
