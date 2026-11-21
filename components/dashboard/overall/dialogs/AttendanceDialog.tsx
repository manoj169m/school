import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { SectionAttendanceDialog } from "./SectionAttendanceDialog";
import { Users } from "lucide-react";

interface ClassData {
  classId: number;
  className: string;
  totalStudents: number;
}

interface AttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBranch: string;
  academicYearId: number;
}

export function AttendanceDialog({
  open,
  onOpenChange,
  selectedBranch,
  academicYearId,
}: AttendanceDialogProps) {
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [classData, setClassData] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassData = async () => {
      if (!selectedBranch || !academicYearId) return;

      try {
        setLoading(true);
        const response = await fetch(
          `/api/branch-classes/${selectedBranch}?academicYearId=${academicYearId}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch class data');
        }

        const data = await response.json();
        setClassData(data);
      } catch (error) {
        console.error("Error fetching class data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchClassData();
    } else {
      // Reset state when dialog closes
      setClassData([]);
      setSelectedClass(null);
      setSectionDialogOpen(false);
    }
  }, [selectedBranch, academicYearId, open]);

  const handleClassClick = (classData: ClassData) => {
    setSelectedClass(classData);
    setSectionDialogOpen(true);
  };

  if (!selectedBranch) return null;
  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">
              Class-wise Attendance Report
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {classData.map((item) => (
              <Card
                key={`class-${item.classId}`}
                className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer bg-gradient-to-br from-blue-500/5 to-purple-500/5"
                onClick={() => handleClassClick(item)}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    {item.className}
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-center items-center">
                    <span className="text-sm font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      Total Students: {item.totalStudents}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {selectedClass && (
        <SectionAttendanceDialog
          open={sectionDialogOpen}
          onOpenChange={(open) => {
            setSectionDialogOpen(open);
            if (!open) {
              setSelectedClass(null);
            }
          }}
          classId={selectedClass.classId}
          className={selectedClass.className}
          branchId={parseInt(selectedBranch)}
          academicYearId={academicYearId}
        />
      )}
    </>
  );
}