"use client";

import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface StudentsListProps {
  standard: number;
  onBack: () => void;
}

// Mock data for students
const students = [
  {
    id: 1,
    name: "John Doe",
    section: "A",
    fatherNumber: "+1234567890",
    hostelName: "Boys Hostel A",
    floor: 2,
    roomNumber: 204,
  },
  {
    id: 2,
    name: "Jane Smith",
    section: "B",
    fatherNumber: "+1234567891",
    hostelName: "Girls Hostel A",
    floor: 1,
    roomNumber: 105,
  },
  // Add more mock data as needed
];

export default function StudentsList({  onBack }: StudentsListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-1">
        <button
          onClick={onBack}
          className="p-2 hover:bg-black/50 text-blue-600 hover:text-white rounded-full transition-colors"
        >
          <ArrowLeft className="h-5  w-5" />
        </button>
        <p className="text-xl  text-blue-600 font-bold">Back</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {students.map((student) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-rose-200 rounded-lg p-4 hover:bg-rose-300 transition-colors"
          >
            <h3 className="text-2xl font-semibold mb-2 text-red-500">
              {student.name}
            </h3>
            <div className="space-y-1 text-gray-900">
              <p>
                <b>Section:</b> {student.section}
              </p>
              <p>
                <b>Father&apos;s Contact:</b> {student.fatherNumber}
              </p>
              <p>
                <b>Hostel:</b> {student.hostelName}
              </p>
              <p>
                <b>Floor:</b> {student.floor}
              </p>
              <p>
                <b>Room Number:</b> {student.roomNumber}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
