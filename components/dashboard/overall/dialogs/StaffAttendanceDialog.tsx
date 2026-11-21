"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import {  Users } from "lucide-react";
import { StaffListDialog } from "./StaffListDialog";

interface StaffAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StaffAttendanceDialog({ open, onOpenChange }: StaffAttendanceDialogProps) {
  const [listDialogOpen, setListDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'present' | 'absent' | null>(null);

  const staffAttendance = {
    departments: [
      { name: "Mathematics", present: 12, absent: 1, total: 13 },
      { name: "Science", present: 15, absent: 2, total: 17 },
      { name: "English", present: 10, absent: 0, total: 10 },
      { name: "Social Studies", present: 8, absent: 1, total: 9 },
      { name: "Physical Education", present: 5, absent: 0, total: 5 },
      { name: "Arts", present: 4, absent: 1, total: 5 },
    ],
  };

  const handleAttendanceClick = (type: 'present' | 'absent') => {
    setSelectedType(type);
    setListDialogOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">Department-wise Staff Attendance</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staffAttendance.departments.map((dept) => (
              <Card
                key={dept.name}
                className="p-4 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-blue-500/5 to-purple-500/5"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-lg">{dept.name}</h3>
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div className="space-y-2">
                  <div 
                    className="flex justify-between items-center cursor-pointer hover:bg-green-500/10 p-2 rounded-lg transition-colors"
                    onClick={() => handleAttendanceClick('present')}
                  >
                    <span className="text-sm text-muted-foreground">Present:</span>
                    <span className="font-semibold text-green-600">{dept.present}</span>
                  </div>
                  <div 
                    className="flex justify-between items-center cursor-pointer hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                    onClick={() => handleAttendanceClick('absent')}
                  >
                    <span className="text-sm text-muted-foreground">Absent:</span>
                    <span className="font-semibold text-red-600">{dept.absent}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${(dept.present / dept.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <StaffListDialog
        open={listDialogOpen}
        onOpenChange={setListDialogOpen}
        type={selectedType}
      />
    </>
  );
}