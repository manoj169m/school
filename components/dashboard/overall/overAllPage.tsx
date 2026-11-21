"use client";

import { UpcomingExamsSection } from "../Academic/exam/examSection";
import { AttendanceOverview } from "./dashboard/AttendanceOverview";
import { UpcomingEvents } from "./dashboard/EventsCard";
import { motion } from "framer-motion";
import { FinanceOverview } from "./dashboard/FinanceOverview";
import { PerformanceChart } from "./dashboard/PerformanceChart";
import StudentStats from "./dashboard/StudentStats";

import { TransportOverview } from "./dashboard/TransportOverview";
import WelcomeHeader from "./dashboard/WelcomeHeader";

export default function OverAllDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-6 space-y-6 animate-fade-in rounded-2xl">
      <WelcomeHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
        <StudentStats />
      </div>
      <AttendanceOverview />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-semibold text-rose-950 mb-2">
              Upcoming Examinations
            </h2>
            <p className="text-rose-600">
              Select an exam and class to view the detailed schedule
            </p>
          </motion.div>
          <div className="h-72 custom-scrollbar overflow-y-auto p-4">
            <UpcomingExamsSection />
          </div>
        </div>
        <UpcomingEvents />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FinanceOverview />
        <TransportOverview />
      </div>
      <PerformanceChart />
    </div>
  );
}
