"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Student {
  name: string;
  rollNo: string;
  enrollmentId: number;
}

interface StudentListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className: string;
  classId: number;
  section: string | null;
  sectionId: number | null;
  type:
    | "present"
    | "absent"
    | "leave"
    | "morning"
    | "afternoon"
    | "onDuty"
    | null;
  branchId: number;
  academicYearId: number;
}

export function StudentListDialog({
  open,
  onOpenChange,
  className,
  classId,
  section,
  sectionId,
  type,
  branchId,
  academicYearId,
}: StudentListDialogProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "info";
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!open || !type || !sectionId || !classId) return;

      try {
        setLoading(true);
        setMessage(null);
        setStudents([]);

        const today = new Date().toISOString().split("T")[0];
        const response = await fetch(
          `/api/attendance/student-list?` +
            `branchId=${branchId}&` +
            `academicYearId=${academicYearId}&` +
            `classId=${classId}&` +
            `sectionId=${sectionId}&` +
            `type=${type}&` +
            `date=${today}`
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage({
            type: "info",
            text: data?.message || "No attendance records available for today",
          });
          return;
        }

        if (!Array.isArray(data)) {
          setMessage({
            type: "error",
            text: "Invalid data format received from server",
          });
          return;
        }

        setStudents(data);
        if (data.length === 0) {
          setMessage({
            type: "info",
            text: "No students found in this category",
          });
        }
      } catch (err) {
        setMessage({
          type: "error",
          text: "Unable to fetch student list. Please try again later.",
        });
        console.error("Error fetching student list:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [
    open,
    className,
    classId,
    section,
    sectionId,
    type,
    branchId,
    academicYearId,
  ]);

  const getTypeStyles = (
    type: StudentListDialogProps["type"]
  ): { bgColor: string; textColor: string } => {
    switch (type) {
      case "present":
        return { bgColor: "bg-green-100", textColor: "text-green-600" };
      case "absent":
        return { bgColor: "bg-red-100", textColor: "text-red-600" };
      case "leave":
        return { bgColor: "bg-rose-100", textColor: "text-rose-600" };
      case "morning":
        return { bgColor: "bg-yellow-100", textColor: "text-yellow-600" };
      case "afternoon":
        return { bgColor: "bg-purple-100", textColor: "text-purple-600" };
      case "onDuty":
        return { bgColor: "bg-blue-100", textColor: "text-blue-600" };
      default:
        return { bgColor: "bg-gray-100", textColor: "text-gray-600" };
    }
  };

  const getTypeLabel = (type: StudentListDialogProps["type"]): string => {
    switch (type) {
      case "present":
        return "Present";
      case "absent":
        return "Absent";
      case "leave":
        return "Leave";
      case "morning":
        return "Morning Present";
      case "afternoon":
        return "Afternoon Present";
      case "onDuty":
        return "On Duty";
      default:
        return "";
    }
  };

  const { bgColor, textColor } = getTypeStyles(type);

  if (!open) return null;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-8" role="status">
          <span className="text-gray-500">Loading student list...</span>
        </div>
      );
    }

    if (message) {
      return (
        <Alert
          variant={message.type === "error" ? "destructive" : "default"}
          className="mb-4"
        >
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      );
    }

    if (students.length === 0) {
      return null;
    }

    return (
      <div
        className="space-y-4 max-h-[60vh] overflow-y-auto"
        role="list"
        aria-label={`${getTypeLabel(type)} students list`}
      >
        {students.map((student) => (
          <Card
            key={student.enrollmentId}
            className="p-4 hover:shadow-lg transition-all duration-300"
            role="listitem"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${bgColor}`}>
                <User className={`h-4 w-4 ${textColor}`} />
              </div>
              <div>
                <h3 className="font-semibold">{student.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Roll No: {student.rollNo}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {getTypeLabel(type)} Students - {className} Standard Section{" "}
            {section}
          </DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
