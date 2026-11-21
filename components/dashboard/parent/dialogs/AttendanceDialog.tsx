"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserCheck } from "lucide-react";
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
import MonthlyAttendanceDialog from "./MonthlyAttendanceDialog";

interface AttendanceData {
  month: string;
  present: number;
  absent: number;
  total: number;
}

interface AttendanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const monthlyData: AttendanceData[] = [
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

export default function AttendanceDialog({
  isOpen,
  onClose,
}: AttendanceDialogProps) {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [showMonthlyDialog, setShowMonthlyDialog] = useState(false);

  const handleBarClick = (data: AttendanceData) => {
    setSelectedMonth(data.month);
    setShowMonthlyDialog(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <UserCheck className="w-6 h-6 text-rose-500" />
              Attendance Record
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            <div className="bg-rose-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-gray-600">Present Days</p>
                  <p className="text-2xl font-bold text-green-600">245</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Days</p>
                  <p className="text-2xl font-bold text-gray-800">268</p>
                </div>
                <div>
                  <p className="text-gray-600">Attendance</p>
                  <p className="text-2xl font-bold text-rose-600">91.4%</p>
                </div>
              </div>
            </div>

            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  onClick={(data) =>
                    data &&
                    handleBarClick(
                      data.activePayload?.[0]?.payload as AttendanceData
                    )
                  }
                >
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
                  <Bar dataKey="present" name="Present Days" fill="#f43f5e">
                    {monthlyData.map((entry) => (
                      <Cell key={`cell-${entry.month}`} cursor="pointer" />
                    ))}
                  </Bar>
                  <Bar dataKey="absent" name="Absent Days" fill="#fecdd3" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <MonthlyAttendanceDialog
        month={selectedMonth}
        isOpen={showMonthlyDialog}
        onClose={() => setShowMonthlyDialog(false)}
      />
    </>
  );
}
