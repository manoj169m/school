"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AttendanceDialog } from "../dialogs/AttendanceDialog";
import { StaffAttendanceDialog } from "../dialogs/StaffAttendanceDialog";
import { BranchSelectionDialog } from "../dialogs/BranchSelector";

interface AcademicYear {
  id: number;
  label: string;
  startDate: string;
  endDate: string;
}

export function AttendanceOverview() {
  const [students, setStudents] = useState({
    totalStudents: 0,
    present: 0,
    absent: 0,
    leave: 0,
    od: 0,
  });
  const [staff, setStaff] = useState({
    present: 0,
    absent: 0,
    leave: 0,
    od: 0,
  });
  console.log(setStaff);
  const [isLoading, setIsLoading] = useState(true);
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);
  const [staffDialogOpen, setStaffDialogOpen] = useState(false);
  const [branchDialogOpen, setBranchDialogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [currentAcademicYear, setCurrentAcademicYear] = useState<AcademicYear | null>(null);

  // Fetch current academic year on component mount
  useEffect(() => {
    const fetchCurrentAcademicYear = async () => {
      try {
        const response = await fetch("/api/academicYears/current");
        const data = await response.json();
        setCurrentAcademicYear(data);
      } catch (error) {
        console.error("Error fetching current academic year:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentAcademicYear();
  }, []);

  // Fetch attendance data
  useEffect(() => {
    const fetchAttendanceData = async () => {
      setIsLoading(true);
      try {
        const [studentResponse] = await Promise.all([
          fetch("/api/attendance/overview"),
          //fetch("/api/attendance/staff-overview")
        ]);

        const [studentData] = await Promise.all([
          studentResponse.json(),
          //staffResponse.json()
        ]);

        setStudents(studentData);
        //setStaff(staffData);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  // Handle student card click
  const handleStudentCardClick = () => {
    // Reset selected branch when opening branch dialog
    setSelectedBranch(null);
    setBranchDialogOpen(true);
  };

  // Handle branch selection
  const handleBranchSelect = (branch: string) => {
    setSelectedBranch(branch);
    setBranchDialogOpen(false);
    // Open student dialog after a short delay to ensure smooth transition
    setTimeout(() => {
      setStudentDialogOpen(true);
    }, 100);
  };

  // Handle student dialog close
  const handleStudentDialogClose = (open: boolean) => {
    setStudentDialogOpen(open);
    if (!open) {
      // Reset selected branch when closing student dialog
      setSelectedBranch(null);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card
        className="p-6 bg-gradient-to-br from-green-500/10 to-blue-500/10 hover:shadow-lg transition-all duration-300 cursor-pointer"
        onClick={handleStudentCardClick}
      >
        <div className="space-y-4">
          <h3 className="font-semibold">Student Attendance</h3>
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center p-2 bg-green-500/20 rounded-lg hover:scale-105 transition-transform">
              <p className="text-xs">Present</p>
              <p className="font-bold">{students.present}</p>
            </div>
            <div className="text-center p-2 bg-red-500/20 rounded-lg hover:scale-105 transition-transform">
              <p className="text-xs">Absent</p>
              <p className="font-bold">{students.absent}</p>
            </div>
            <div className="text-center p-2 bg-yellow-500/20 rounded-lg hover:scale-105 transition-transform">
              <p className="text-xs">Leave</p>
              <p className="font-bold">{students.leave}</p>
            </div>
            <div className="text-center p-2 bg-blue-500/20 rounded-lg hover:scale-105 transition-transform">
              <p className="text-xs">OD</p>
              <p className="font-bold">{students.od}</p>
            </div>
          </div>
          <p className="text-sm">Click the card to view attendance report</p>
        </div>
      </Card>

      <Card
        className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:shadow-lg transition-all duration-300 cursor-pointer"
        onClick={() => setStaffDialogOpen(true)}
      >
        <div className="space-y-4">
          <h3 className="font-semibold">Staff Attendance</h3>
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center p-2 bg-green-500/20 rounded-lg hover:scale-105 transition-transform">
              <p className="text-xs">Present</p>
              <p className="font-bold">{staff.present}</p>
            </div>
            <div className="text-center p-2 bg-red-500/20 rounded-lg hover:scale-105 transition-transform">
              <p className="text-xs">Absent</p>
              <p className="font-bold">{staff.absent}</p>
            </div>
            <div className="text-center p-2 bg-yellow-500/20 rounded-lg hover:scale-105 transition-transform">
              <p className="text-xs">Leave</p>
              <p className="font-bold">{staff.leave}</p>
            </div>
            <div className="text-center p-2 bg-blue-500/20 rounded-lg hover:scale-105 transition-transform">
              <p className="text-xs">OD</p>
              <p className="font-bold">{staff.od}</p>
            </div>
          </div>
          <p className="text-sm">Click the card to view attendance report</p>
        </div>
      </Card>

      <BranchSelectionDialog
        open={branchDialogOpen}
        onOpenChange={setBranchDialogOpen}
        onBranchSelect={handleBranchSelect}
      />

      {selectedBranch && currentAcademicYear && (
        <AttendanceDialog
          open={studentDialogOpen}
          onOpenChange={handleStudentDialogClose}
          selectedBranch={selectedBranch}
          academicYearId={currentAcademicYear.id}
        />
      )}

      <StaffAttendanceDialog
        open={staffDialogOpen}
        onOpenChange={setStaffDialogOpen}
      />
    </div>
  );
}