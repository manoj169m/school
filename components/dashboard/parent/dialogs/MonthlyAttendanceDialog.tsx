"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Calendar, Clock, CheckCircle2, XCircle } from "lucide-react";

interface MonthlyAttendanceDialogProps {
  month: string | null;
  isOpen: boolean;
  onClose: () => void;
}

// Generate sample data for a month
const generateMonthData = (month: string) => {
  if (!month) return [];

  const daysInMonth = new Date(
    2024,
    [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ].indexOf(month) + 1,
    0
  ).getDate();

  return Array.from({ length: daysInMonth }, (_, i) => ({
    date: `2024-${String(
      (
        [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ].indexOf(month) + 1
      )
        .toString()
        .padStart(2, "0")
    )}-${String(i + 1).padStart(2, "0")}`,
    status: Math.random() > 0.1 ? "present" : "absent",
    timeIn: "8:30 AM",
    timeOut: "3:30 PM",
    reason: "Medical appointment",
  }));
};

export default function MonthlyAttendanceDialog({
  month,
  isOpen,
  onClose,
}: MonthlyAttendanceDialogProps) {
  if (!month) return null;

  const monthData = generateMonthData(month);
  const presentDays = monthData.filter(
    (day) => day.status === "present"
  ).length;
  const absentDays = monthData.filter((day) => day.status === "absent").length;
  const totalDays = monthData.length;
  const attendancePercentage = ((presentDays / totalDays) * 100).toFixed(1);

  // Calculate the first day of the month to determine calendar grid positioning
  const firstDayOfMonth = new Date(
    2024,
    [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ].indexOf(month),
    1
  ).getDay();

  // Create empty cells for the calendar grid
  const emptyCells = Array(firstDayOfMonth).fill(null);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Calendar className="w-6 h-6 text-red-500" />
            {month} Attendance Details
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="bg-rose-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-gray-600">Present Days</p>
                <p className="text-2xl font-bold text-green-600">
                  {presentDays}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Absent Days</p>
                <p className="text-2xl font-bold text-red-600">{absentDays}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Days</p>
                <p className="text-2xl font-bold text-gray-800">{totalDays}</p>
              </div>
              <div>
                <p className="text-gray-600">Attendance</p>
                <p className="text-2xl font-bold text-violet-600">
                  {attendancePercentage}%
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">Daily View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="mt-4">
              <div className="grid gap-3">
                {monthData.map((day, index) => (
                  <motion.div
                    key={day.date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg ${
                      day.status === "present" ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {day.status === "present" ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium text-gray-800">
                            {day.date}
                          </p>
                          {day.status === "present" && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              {day.timeIn} - {day.timeOut}
                            </div>
                          )}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          day.status === "present"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {day.status}
                      </span>
                    </div>
                    {day.status === "absent" && day.reason && (
                      <p className="mt-2 text-sm text-gray-600 ml-8">
                        Reason: {day.reason}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="calendar" className="mt-4">
              <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center font-medium text-gray-600 p-2"
                    >
                      {day}
                    </div>
                  )
                )}
                {emptyCells.map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square" />
                ))}
                {monthData.map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className={`aspect-square rounded-lg flex items-center justify-center p-2 ${
                      day.status === "present"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {new Date(day.date).getDate()}
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
