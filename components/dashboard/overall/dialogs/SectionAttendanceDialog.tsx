"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { StudentListDialog } from "./StudentListDialog";
import { Users } from "lucide-react";

interface SectionAttendance {
  sectionId: number;
  sectionName: string;
  total: number;
  present: number;
  absent: number;
  leave: number;
  morningPresent: number;
  afternoonPresent: number;
  onDuty: number;
  isPosted: boolean;
}

interface SectionAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: number;
  className: string;
  branchId: number;
  academicYearId: number;
}

export function SectionAttendanceDialog({
  open,
  onOpenChange,
  classId,
  className,
  branchId,
  academicYearId,
}: SectionAttendanceDialogProps) {
  const [studentListOpen, setStudentListOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(
    null
  );
  const [selectedType, setSelectedType] = useState<
    "present" | "absent" | "leave" | "morning" | "afternoon" | "onDuty" | null
  >(null);
  const [sectionAttendance, setSectionAttendance] = useState<
    SectionAttendance[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (!open || !classId || !branchId || !academicYearId) return;

      try {
        setLoading(true);
        const today = new Date().toISOString().split("T")[0];
        const response = await fetch(
          `/api/class-attendance/${classId}?` +
            `branchId=${branchId}&` +
            `academicYearId=${academicYearId}&` +
            `date=${today}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch attendance data");
        }

        const data = await response.json();
        setSectionAttendance(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching section attendance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [open, classId, branchId, academicYearId]);

  const handleAttendanceClick = (
    section: string,
    sectionId: number,
    type: typeof selectedType
  ) => {
    setSelectedSection(section);
    setSelectedSectionId(sectionId);
    setSelectedType(type);
    setStudentListOpen(true);
  };

  const renderAttendanceValue = (
    value: number,
    isPosted: boolean,
    colorClass: string
  ) => {
    if (!isPosted) {
      return <span className="font-medium text-gray-400">Not Posted</span>;
    }
    return <span className={`font-semibold ${colorClass}`}>{value}</span>;
  };

  const renderDialogContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          Loading attendance data...
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center p-8 text-red-500">
          Error: {error}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sectionAttendance.map((data) => (
          <Card
            key={data.sectionId}
            className={`p-4 hover:shadow-lg transition-all duration-300 ${
              data.isPosted
                ? "bg-gradient-to-br from-indigo-500/5 to-purple-500/5"
                : "bg-gray-50"
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-500" />
                Section {data.sectionName}
              </h3>
              <span className="text-sm font-medium bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                Total: {data.total}
              </span>
            </div>
            <div className="space-y-2">
              <div
                className={`flex justify-between items-center p-2 rounded-lg ${
                  data.isPosted ? "cursor-pointer hover:bg-green-500/10" : ""
                } transition-colors`}
                onClick={() =>
                  data.isPosted &&
                  handleAttendanceClick(
                    data.sectionName,
                    data.sectionId,
                    "present"
                  )
                }
                role={data.isPosted ? "button" : undefined}
                tabIndex={data.isPosted ? 0 : undefined}
                aria-label={`Present students in Section ${data.sectionName}: ${data.present}`}
              >
                <span className="text-sm text-muted-foreground">Present:</span>
                {renderAttendanceValue(
                  data.present,
                  data.isPosted,
                  "text-green-600"
                )}
              </div>

              <div
                className={`flex justify-between items-center p-2 rounded-lg ${
                  data.isPosted ? "cursor-pointer hover:bg-red-500/10" : ""
                } transition-colors`}
                onClick={() =>
                  data.isPosted &&
                  handleAttendanceClick(
                    data.sectionName,
                    data.sectionId,
                    "absent"
                  )
                }
                role={data.isPosted ? "button" : undefined}
                tabIndex={data.isPosted ? 0 : undefined}
                aria-label={`Absent students in Section ${data.sectionName}: ${data.absent}`}
              >
                <span className="text-sm text-muted-foreground">Absent:</span>
                {renderAttendanceValue(
                  data.absent,
                  data.isPosted,
                  "text-red-600"
                )}
              </div>

              <div
                className={`flex justify-between items-center p-2 rounded-lg ${
                  data.isPosted ? "cursor-pointer hover:bg-rose-500/10" : ""
                } transition-colors`}
                onClick={() =>
                  data.isPosted &&
                  handleAttendanceClick(
                    data.sectionName,
                    data.sectionId,
                    "leave"
                  )
                }
                role={data.isPosted ? "button" : undefined}
                tabIndex={data.isPosted ? 0 : undefined}
                aria-label={`Students on leave in Section ${data.sectionName}: ${data.leave}`}
              >
                <span className="text-sm text-muted-foreground">Leave:</span>
                {renderAttendanceValue(
                  data.leave,
                  data.isPosted,
                  "text-rose-700"
                )}
              </div>

              <div
                className={`flex justify-between items-center p-2 rounded-lg ${
                  data.isPosted ? "cursor-pointer hover:bg-yellow-500/10" : ""
                } transition-colors`}
                onClick={() =>
                  data.isPosted &&
                  handleAttendanceClick(
                    data.sectionName,
                    data.sectionId,
                    "morning"
                  )
                }
                role={data.isPosted ? "button" : undefined}
                tabIndex={data.isPosted ? 0 : undefined}
                aria-label={`Morning present students in Section ${data.sectionName}: ${data.morningPresent}`}
              >
                <span className="text-sm text-muted-foreground">Morning:</span>
                {renderAttendanceValue(
                  data.morningPresent,
                  data.isPosted,
                  "text-yellow-700"
                )}
              </div>

              <div
                className={`flex justify-between items-center p-2 rounded-lg ${
                  data.isPosted ? "cursor-pointer hover:bg-purple-500/10" : ""
                } transition-colors`}
                onClick={() =>
                  data.isPosted &&
                  handleAttendanceClick(
                    data.sectionName,
                    data.sectionId,
                    "afternoon"
                  )
                }
                role={data.isPosted ? "button" : undefined}
                tabIndex={data.isPosted ? 0 : undefined}
                aria-label={`Afternoon present students in Section ${data.sectionName}: ${data.afternoonPresent}`}
              >
                <span className="text-sm text-muted-foreground">
                  Afternoon Present:
                </span>
                {renderAttendanceValue(
                  data.afternoonPresent,
                  data.isPosted,
                  "text-purple-700"
                )}
              </div>

              <div
                className={`flex justify-between items-center p-2 rounded-lg ${
                  data.isPosted ? "cursor-pointer hover:bg-blue-500/10" : ""
                } transition-colors`}
                onClick={() =>
                  data.isPosted &&
                  handleAttendanceClick(
                    data.sectionName,
                    data.sectionId,
                    "onDuty"
                  )
                }
                role={data.isPosted ? "button" : undefined}
                tabIndex={data.isPosted ? 0 : undefined}
                aria-label={`Students on duty in Section ${data.sectionName}: ${data.onDuty}`}
              >
                <span className="text-sm text-muted-foreground">On Duty:</span>
                {renderAttendanceValue(
                  data.onDuty,
                  data.isPosted,
                  "text-blue-700"
                )}
              </div>

              <div
                className="w-full bg-gray-200 rounded-full h-2"
                role="progressbar"
                aria-label={`Attendance percentage for Section ${data.sectionName}`}
                aria-valuenow={
                  data.isPosted ? (data.present / data.total) * 100 : 0
                }
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    data.isPosted ? "bg-indigo-600" : "bg-gray-400"
                  }`}
                  style={{
                    width: data.isPosted
                      ? `${(data.present / data.total) * 100}%`
                      : "0%",
                  }}
                ></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {className} Standard - Section-wise Attendance
            </DialogTitle>
          </DialogHeader>
          {renderDialogContent()}
        </DialogContent>
      </Dialog>

      <StudentListDialog
        open={studentListOpen}
        onOpenChange={setStudentListOpen}
        className={className}
        classId={classId}
        section={selectedSection}
        sectionId={selectedSectionId}
        type={selectedType}
        branchId={branchId}
        academicYearId={academicYearId}
      />
    </>
  );
}
