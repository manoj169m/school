"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Users, UserRound, UserSquare, } from "lucide-react";

// Types
interface ClassData {
  id: string;
  className: string;
  section: string;
  totalStudents: number;
  boysCount: number;
  girlsCount: number;
}

// Mock Data (replace with your actual data source)
const classData: ClassData[] = [
  {
    id: "1",
    className: "Class 1",
    section: "A",
    totalStudents: 45,
    boysCount: 24,
    girlsCount: 21,
  },
  {
    id: "2",
    className: "Class 1",
    section: "B",
    totalStudents: 42,
    boysCount: 22,
    girlsCount: 20,
  },
  {
    id: "3",
    className: "Class 2",
    section: "A",
    totalStudents: 48,
    boysCount: 26,
    girlsCount: 22,
  },
  {
    id: "4",
    className: "Class 2",
    section: "B",
    totalStudents: 46,
    boysCount: 24,
    girlsCount: 22,
  },
  {
    id: "5",
    className: "Class 3",
    section: "A",
    totalStudents: 44,
    boysCount: 23,
    girlsCount: 21,
  },
  {
    id: "6",
    className: "Class 3",
    section: "B",
    totalStudents: 43,
    boysCount: 22,
    girlsCount: 21,
  },
  // Add more mock data as needed
];

// DataTableStudent Component
function DataTableStudent({
  data,
  onRowClick,
}: {
  data: ClassData[];
  onRowClick: (className: string) => void;
}) {
  const groupedData = data.reduce((acc, curr) => {
    const existingClass = acc.find((item) => item.className === curr.className);
    if (existingClass) {
      existingClass.totalStudents += curr.totalStudents;
      existingClass.boysCount += curr.boysCount;
      existingClass.girlsCount += curr.girlsCount;
    } else {
      acc.push({
        className: curr.className,
        totalStudents: curr.totalStudents,
        boysCount: curr.boysCount,
        girlsCount: curr.girlsCount,
      });
    }
    return acc;
  }, [] as Array<Omit<ClassData, "id" | "section">>);

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-rose-100 hover:bg-rose-100">
            <TableHead className="font-semibold text-rose-950">Class</TableHead>
            <TableHead className="font-semibold text-rose-950">
              Total Students
            </TableHead>
            <TableHead className="font-semibold text-rose-950">Boys</TableHead>
            <TableHead className="font-semibold text-rose-950">Girls</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groupedData.map((item) => (
            <TableRow
              key={item.className}
              className="cursor-pointer hover:bg-purple-50 transition-colors"
              onClick={() => onRowClick(item.className)}
            >
              <TableCell className="font-medium">{item.className}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-rose-500" />
                  {item.totalStudents}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <UserSquare className="h-4 w-4 text-blue-500" />
                  {item.boysCount}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-pink-500" />
                  {item.girlsCount}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// StudentDetailsDialog Component
function StudentDetailsDialog({
  isOpen,
  onClose,
  className,
  data,
}: {
  isOpen: boolean;
  onClose: () => void;
  className: string;
  data: ClassData[];
}) {
  const classData = data.filter((item) => item.className === className);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-rose-950">
            {className} - Section-wise Details
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {classData.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-lg p-6 shadow-lg border border-rose-100 hover:border-rose-300 transition-colors"
            >
              <h3 className="text-lg font-semibold text-rose-950 mb-4">
                Section {section.section}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-rose-50 p-3 rounded-md">
                  <span className="text-rose-700 font-medium flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Total Students
                  </span>
                  <span className="text-rose-950 font-bold">
                    {section.totalStudents}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-blue-50 p-3 rounded-md">
                  <span className="text-blue-700 font-medium flex items-center gap-2">
                    <UserSquare className="h-5 w-5" />
                    Boys
                  </span>
                  <span className="text-blue-950 font-bold">
                    {section.boysCount}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-pink-50 p-3 rounded-md">
                  <span className="text-pink-700 font-medium flex items-center gap-2">
                    <UserRound className="h-5 w-5" />
                    Girls
                  </span>
                  <span className="text-pink-950 font-bold">
                    {section.girlsCount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Main ClassReport Component
export default function ClassReport() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  return (
    <div>
      <div className="">
        <div className="relative rounded-[10px] bg-white  p-6 shadow-md">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-rose-950 mb-2">
              Class-wise Student Distribution
            </h2>
            <p className="text-rose-600 text-base">
              Click on any row to view detailed section-wise information
            </p>
          </div>

          <DataTableStudent
            data={classData}
            onRowClick={(className) => setSelectedClass(className)}
          />
        </div>

        <StudentDetailsDialog
          isOpen={!!selectedClass}
          onClose={() => setSelectedClass(null)}
          className={selectedClass || ""}
          data={classData}
        />
      </div>
    </div>
  );
}
