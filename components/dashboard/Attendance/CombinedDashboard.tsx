'use client';

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StaffAttendanceDashboard from "./staff/StaffDashboard";
import AttendanceDashboard from "./students/StudentDashboard";

const CombinedDashboard = () => {
  const [showStaffDashboard, setShowStaffDashboard] = useState(false);

  const TabsToggle = () => (
    <div className="flex flex-col items-start gap-2">
      <p className="text-sm text-gray-600">Switch between dashboards</p>
      <Tabs
        defaultValue={showStaffDashboard ? "staff" : "students"}
        onValueChange={(value) => setShowStaffDashboard(value === "staff")}
        className="w-full sm:w-64 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-lg p-1"
      >
        <TabsList className="grid w-full grid-cols-2 bg-white/10 rounded-md">
          <TabsTrigger
            value="students"
            className="text-sm font-medium text-white data-[state=active]:bg-white data-[state=active]:text-indigo-600 transition-all duration-200"
          >
            Students
          </TabsTrigger>
          <TabsTrigger
            value="staff"
            className="text-sm font-medium text-white data-[state=active]:bg-white data-[state=active]:text-indigo-600 transition-all duration-200"
          >
            Staff
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );

  return (
    <div className=" bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
            {/* Title */}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                {showStaffDashboard
                  ? "Staff Attendance Management"
                  : "Student Attendance Management"}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Monitor and manage attendance records with ease
              </p>
            </div>
            
            {/* Tabs Toggle */}
            <TabsToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
          <div className="transition-all duration-300 ease-in-out">
            {showStaffDashboard ? <StaffAttendanceDashboard /> : <AttendanceDashboard />}
          </div>
    </div>
  );
};

export default CombinedDashboard;