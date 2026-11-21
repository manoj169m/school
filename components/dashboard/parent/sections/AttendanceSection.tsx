"use client";

import { motion } from "framer-motion";
import { UserCheck, ArrowLeft } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useState } from "react";
import MonthlyAttendanceDialog from "../dialogs/MonthlyAttendanceDialog";

interface AttendanceSectionProps {
  onBack: () => void;
}

interface MonthlyAttendanceData {
  month: string;
  present: number;
  absent: number;
  total: number;
}

interface ChartClickEvent {
  activePayload?: Array<{
    payload: MonthlyAttendanceData;
  }>;
}

const monthlyData: MonthlyAttendanceData[] = [
  { month: "Jan", present: 22, absent: 1, total: 23 },
  { month: "Feb", present: 19, absent: 2, total: 21 },
  { month: "Mar", present: 20, absent: 3, total: 23 },
  { month: "Apr", present: 21, absent: 2, total: 23 },
  { month: "May", present: 18, absent: 4, total: 22 },
  { month: "Jun", present: 20, absent: 2, total: 22 },
  { month: "Jul", present: 21, absent: 1, total: 22 },
  { month: "Aug", present: 22, absent: 1, total: 23 },
  { month: "Sep", present: 19, absent: 3, total: 22 },
  { month: "Oct", present: 20, absent: 2, total: 22 },
  { month: "Nov", present: 21, absent: 2, total: 23 },
  { month: "Dec", present: 20, absent: 3, total: 23 },
];

export default function AttendanceSection({ onBack }: AttendanceSectionProps) {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [showMonthlyDialog, setShowMonthlyDialog] = useState(false);

  const handleBarClick = (data: ChartClickEvent) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const clickedMonth = data.activePayload[0].payload.month;
      setSelectedMonth(clickedMonth);
      setShowMonthlyDialog(true);
    }
  };

  const totalPresent = monthlyData.reduce(
    (sum, month) => sum + month.present,
    0
  );
  const totalAbsent = monthlyData.reduce((sum, month) => sum + month.absent, 0);
  const totalDays = monthlyData.reduce((sum, month) => sum + month.total, 0);
  const attendancePercentage = ((totalPresent / totalDays) * 100).toFixed(1);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-red-500" />
            Attendance Record
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </motion.button>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-gray-600">Present Days</p>
              <p className="text-2xl font-bold text-green-600">
                {totalPresent}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Absent Days</p>
              <p className="text-2xl font-bold text-red-600">{totalAbsent}</p>
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

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} onClick={handleBarClick}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  axisLine={true}
                  tickLine={true}
                  scale="band"
                  padding={{ left: 30, right: 30 }}
                />
                <YAxis
                  axisLine={true}
                  tickLine={true}
                  width={60}
                  padding={{ top: 20, bottom: 20 }}
                />
                <Tooltip />
                <Bar
                  dataKey="present"
                  name="Present Days"
                  fill="#f43f5e"
                  cursor="pointer"
                >
                  {monthlyData.map((entry) => (
                    <Cell
                      key={`cell-${entry.month}`}
                      cursor="pointer"
                      onClick={() => {
                        setSelectedMonth(entry.month);
                        setShowMonthlyDialog(true);
                      }}
                    />
                  ))}
                </Bar>
                <Bar dataKey="absent" name="Absent Days" fill="#fecdd3" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      <MonthlyAttendanceDialog
        month={selectedMonth}
        isOpen={showMonthlyDialog}
        onClose={() => setShowMonthlyDialog(false)}
      />
    </>
  );
}
