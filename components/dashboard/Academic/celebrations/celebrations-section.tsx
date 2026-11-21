"use client";

import { useState, useEffect } from "react";
import { CelebrationCard } from "./celebration-card";
import { CelebrationDetailsDialog } from "./celebration-details-dialog";
import { format } from "date-fns";
import { 
  CelebrationType, 
  Student, 
  Employee, 
  WeekDate,
  APIResponse,
  APIEmployee,
  APIWeekDate,
  APIStudent
} from "@/types/celebrations";

interface Branch {
  id: string;
  acronym: string;
}

interface Celebrations {
  studentBirthdays: Student[];
  employeeBirthdays: Employee[];
  workAnniversaries: Employee[];
}

export function CelebrationsSection() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [weekDates, setWeekDates] = useState<WeekDate[]>([]);
  const [celebrations, setCelebrations] = useState<Celebrations>({
    studentBirthdays: [],
    employeeBirthdays: [],
    workAnniversaries: [],
  });
  const [selectedType, setSelectedType] = useState<CelebrationType | null>(null);

  // Fetch branches on component mount
  useEffect(() => {
    fetch("/api/branches")
      .then((res) => res.json())
      .then((data: Branch[]) => setBranches(data));
  }, []);

  // Fetch celebrations data when branch or date changes
  useEffect(() => {
    fetch(
      `/api/celebrations?branchId=${selectedBranch}&date=${selectedDate.toISOString()}`
    )
      .then((res) => res.json())
      .then((data: APIResponse) => {
        const typedData: Celebrations = {
          studentBirthdays: data.studentBirthdays.map((student: APIStudent): Student => ({
            id: student.student.id,
            name: `${student.student.firstName} ${student.student.lastName}`,
            imageUrl: student.student.imageUrl || '/placeholder-avatar.jpg',
            className: student.class.name,
            section: student.section.name,
            rollNumber: student.student.rollNo || '',
            age: calculateAge(student.student.dateOfBirth),
          })),
          employeeBirthdays: data.employeeBirthdays.map((employee: APIEmployee): Employee => ({
            id: employee.id,
            name: `${employee.firstName} ${employee.lastName}`,
            imageUrl: employee.imageUrl || '/placeholder-avatar.jpg',
            designation: employee.designation.title,
            department: employee.department.name,
            age: employee.dateOfBirth ? calculateAge(employee.dateOfBirth) : 0,
          })),
          workAnniversaries: data.workAnniversaries.map((employee: APIEmployee): Employee => ({
            id: employee.id,
            name: `${employee.firstName} ${employee.lastName}`,
            imageUrl: employee.imageUrl || '/placeholder-avatar.jpg',
            designation: employee.designation.title,
            department: employee.department.name,
            age: employee.dateOfBirth ? calculateAge(employee.dateOfBirth) : 0,
            yearsOfService: calculateYearsOfService(employee.dateOfJoin),
          })),
        };
        setCelebrations(typedData);
        setWeekDates(data.weekDates.map((date: APIWeekDate): WeekDate => ({
          date: new Date(date.date),
          dayName: date.dayName,
          dayNumber: date.dayNumber,
        })));
      });
  }, [selectedBranch, selectedDate]);
  
  // Helper functions
  function calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  
  function calculateYearsOfService(dateOfJoin: string): number {
    const today = new Date();
    const joinDate = new Date(dateOfJoin);
    let years = today.getFullYear() - joinDate.getFullYear();
    const monthDiff = today.getMonth() - joinDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < joinDate.getDate())) {
      years--;
    }
    return years;
  }

  const getCelebrationData = () => {
    if (!selectedType) return [];
    switch (selectedType) {
      case "student-birthday":
        return celebrations.studentBirthdays;
      case "employee-birthday":
        return celebrations.employeeBirthdays;
      case "employee-anniversary":
        return celebrations.workAnniversaries;
      default:
        return [];
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-center">
        <h1 className="text-3xl font-bold text-black">Best Wishes To</h1>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold text-red-500">
          {format(selectedDate, "dd MMM")}
        </h2>
        <div>
          <select
            className="flex items-center text-sm bg-transparent font-bold border border-red-800 text-red-800 px-5 py-1 rounded-sm transition duration-300 focus:outline-none focus:ring-0"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="all">All Branches</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.acronym}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((day, index) => (
          <div
            key={index}
            className="text-center text-gray-400 font-medium text-sm"
          >
            {day.dayName}
          </div>
        ))}

        {weekDates.map((date, index) => (
          <div
            key={index}
            onClick={() => setSelectedDate(date.date)}
            className={`flex items-center justify-center w-10 h-10 rounded-full cursor-pointer transition-all duration-300 ${
              format(date.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
                ? "bg-red-600 text-white"
                : "bg-[#FCE8E8] text-black hover:bg-[#FFD9D9]"
            }`}
          >
            {date.dayNumber}
          </div>
        ))}
      </div>

      <div className="mt-10 space-y-4">
        <CelebrationCard
          title="Student Birthdays"
          count={celebrations.studentBirthdays.length}
          type="birthday"
          onClick={() => setSelectedType("student-birthday")}
        />
        <CelebrationCard
          title="Staff Birthdays"
          count={celebrations.employeeBirthdays.length}
          type="birthday"
          onClick={() => setSelectedType("employee-birthday")}
        />
        <CelebrationCard
          title="Work Anniversaries"
          count={celebrations.workAnniversaries.length}
          type="anniversary"
          onClick={() => setSelectedType("employee-anniversary")}
        />
      </div>

      <CelebrationDetailsDialog
        isOpen={!!selectedType}
        onClose={() => setSelectedType(null)}
        type={selectedType ?? "student-birthday"}
        data={getCelebrationData()}
      />
    </div>
  );
}