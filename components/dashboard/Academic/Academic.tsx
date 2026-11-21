import React from "react";
import ClassReport from "./cards/classwiseReport";
import { CelebrationsSection } from "./celebrations/celebrations-section";
import { OverallStudentCount } from "./student-count/overall-student-count";
import { StudentDistributionSection } from "./student-distribution/student-distribution-section";
import { EventsSection } from "./events/events-section";
import { motion } from "framer-motion";
import { UpcomingExamsSection } from "./exam/examSection";
const Academic = () => {
  return (
    <div className="p-4">
      <OverallStudentCount />

      <div className="grid grid-cols-12 gap-4">
        {/* Left Column */}
        <div className="col-span-12 xl:col-span-6 space-y-5">
          {/* <DairyRemainderCard /> */}
          <ClassReport />
          <StudentDistributionSection />
        </div>

        {/* Right Column */}
        <div className="col-span-12 xl:col-span-6 space-y-5">
          <CelebrationsSection />
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
            <div className="h-96 custom-scrollbar overflow-y-auto p-4">
              <UpcomingExamsSection />
            </div>
          </div>
          {/* <UpcomingExamsSection /> */}
        </div>
      </div>
      <div className="mt-6">
        <EventsSection />
      </div>
    </div>
  );
};

export default Academic;
