import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  UserCheck,
  UserX,
  Loader2,
  User,
  School,
  BookOpen,
} from "lucide-react";
import { AttendanceStatus } from "@prisma/client";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

interface AttendanceRecord {
  date: string;
  day: string;
  status: AttendanceStatus | "NA";
  remarks?: string | null;
}

interface AttendanceData {
  studentAttendance: {
    attendanceRecords: AttendanceRecord[];
    summary?: {
      totalDays: number;
      presentDays: number;
      absentDays: number;
      percentage: number;
    };
  };
  currentEnrollment: {
    academicYear: string;
    className: string;
    sectionName: string;
    branchName: string; // Added branch name
  };
  student: {
    // Added student interface
    id: number;
    studentName: string;
    admissionNo: string | null;
    rollNo: string | null;
  };
}

export default function AttendanceTracker({
  attendanceData,
}: {
  attendanceData: AttendanceData;
}) {
  const { studentAttendance, currentEnrollment, student } = attendanceData;
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>(
    []
  );

  const getDaysInMonth = (month: string, year: string) => {
    const monthIndex = months.indexOf(month);
    const daysInMonth = new Date(parseInt(year), monthIndex + 1, 0).getDate();
    const days: AttendanceRecord[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(parseInt(year), monthIndex, day);

      // Format the date to ensure consistent YYYY-MM-DD format
      const formattedDate = `${year}-${String(monthIndex + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

      days.push({
        date: formattedDate,
        day: dayName,
        status: "NA" as const,
        remarks: null,
      });
    }

    return days;
  };

  useEffect(() => {
    if (!selectedMonth || !selectedYear) return;
    setLoading(true);

    try {
      // Get all days in the selected month
      const allDays = getDaysInMonth(selectedMonth, selectedYear);
      const monthIndex = months.indexOf(selectedMonth);

      // Create a map for existing records
      const existingRecords = new Map(
        studentAttendance.attendanceRecords
          .filter((record) => {
            const recordDate = new Date(record.date);
            return (
              recordDate.getMonth() === monthIndex &&
              recordDate.getFullYear() === parseInt(selectedYear)
            );
          })
          .map((record) => [record.date, record])
      );

      // Merge with priority to existing records
      const mergedRecords = allDays.map(
        (dayRecord) => existingRecords.get(dayRecord.date) || dayRecord
      );

      setFilteredRecords(mergedRecords);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, studentAttendance]);

  const getStatusIcon = (status: AttendanceStatus | "NA") => {
    switch (status) {
      case "P":
        return <UserCheck className="h-4 w-4 text-green-500" />;
      case "A":
        return <UserX className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: AttendanceStatus | "NA") => {
    if (status === "NA") return "Not Posted";

    const statusMap: Record<AttendanceStatus, string> = {
      P: "Present",
      A: "Absent",
      L: "Leave",
      FN: "Forenoon",
      AN: "Afternoon",
      H: "Holiday",
      OD: "On Duty",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: AttendanceStatus | "NA") => {
    switch (status) {
      case "P":
        return "text-green-600";
      case "A":
        return "text-red-600";
      case "L":
        return "text-yellow-600";
      case "FN":
        return "text-blue-600";
      case "AN":
        return "text-purple-600";
      case "H":
        return "text-gray-600";
      case "OD":
        return "text-orange-600";
      case "NA":
        return "text-gray-400";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className="shadow-lg mt-5">
      <CardHeader className="space-y-4 pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Monthly Attendance Details
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {currentEnrollment.academicYear}
          </div>
        </div>

        {/* New section for student and branch details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-3 ">
          <div className="flex items-center gap-4 p-3 bg-red-50 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-center h-10 w-10 bg-red-600 rounded-full">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="block text-sm font-semibold text-gray-600">
                Student Name:
              </span>
              <span className="text-base text-gray-800 font-bold">
                {student.studentName}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-red-50 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-center h-10 w-10 bg-red-600 rounded-full">
              <BookOpen  className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="block text-sm font-semibold text-gray-600">
                Class & Section:
              </span>
              <span className="text-base text-gray-800 font-bold">
                {`${currentEnrollment.className} - ${currentEnrollment.sectionName}`}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-red-50 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-center h-10 w-10 bg-red-600 rounded-full">
              <School className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="block text-sm font-semibold text-gray-600">
                Branch:
              </span>
              <span className="text-base text-gray-800 font-bold">
                {currentEnrollment.branchName}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 ">
          <div className="w-48">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-48">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : selectedMonth && selectedYear ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-20">S.No</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.day}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <span className={getStatusColor(record.status)}>
                          {getStatusText(record.status)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {record.remarks || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Please select both month and year to view attendance data
          </div>
        )}
      </CardContent>
    </Card>
  );
}
