"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

interface StaffListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'present' | 'absent' | null;
}

export function StaffListDialog({ open, onOpenChange, type }: StaffListDialogProps) {
  const staffList = {
    present: [
      { name: "John Smith", designation: "Senior Teacher", department: "Mathematics" },
      { name: "Sarah Johnson", designation: "HOD", department: "Science" },
      { name: "Michael Brown", designation: "Teacher", department: "English" },
    ],
    absent: [
      { name: "Robert Wilson", designation: "Teacher", department: "Mathematics" },
      { name: "Emily Davis", designation: "Teacher", department: "Science" },
    ],
  };

  const list = type === 'present' ? staffList.present : staffList.absent;
  const statusColor = type === 'present' ? 'green' : 'red';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            {type === 'present' ? 'Present' : 'Absent'} Staff List
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {list.map((staff, index) => (
            <Card
              key={index}
              className={`p-4 hover:shadow-lg transition-all duration-300 animate-fade-in bg-gradient-to-br from-${statusColor}-500/10 to-blue-500/10`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{staff.name}</h3>
                  <p className="text-sm text-muted-foreground">{staff.designation}</p>
                </div>
                <span className={`text-sm font-medium text-${statusColor}-600`}>
                  {staff.department}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}