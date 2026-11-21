"use client";

import { useState } from "react";

export function useTransport() {
  const [transport] = useState({
    buses: 15,
    routes: 12,
    totalStudents: 850,
  });

  return transport;
}

export function useStudentStats() {
  const [stats, setStats] = useState({
    total: 1250,
    enquiry: 180,
    admitted: 1050,
    dropout: 20,
  });

  return stats;
}

export function usePerformance() {
  const [performance] = useState([
    { name: "Academics", value: 85 },
    { name: "Sports", value: 75 },
    { name: "Extra-Curricular", value: 90 },
  ]);

  return performance;
}

export interface GradeData {
  grade: string;
  range: string;
  count: number;
  color: string;
}

export function useGradePerformance() {
  const [gradeData] = useState<GradeData[]>([
    { grade: "A+", range: "90-100", count: 125, color: "#22c55e" },
    { grade: "A", range: "80-89", count: 220, color: "#3b82f6" },
    { grade: "B+", range: "70-79", count: 180, color: "#6366f1" },
    { grade: "B", range: "60-69", count: 150, color: "#8b5cf6" },
    { grade: "C", range: "50-59", count: 95, color: "#ec4899" },
    { grade: "D", range: "40-49", count: 45, color: "#f43f5e" },
    { grade: "F", range: "Below 40", count: 25, color: "#ef4444" },
  ]);

  return gradeData;
}

export function useFinance() {
  const [finance] = useState({
    receivable: 2500000,
    payable: 1800000,
  });

  return finance;
}

export function useAttendance() {
  const [attendance] = useState({
    students: {
      present: 1150,
      absent: 50,
      leave: 1,
      od: 1,
    },
    staff: {
      present: 95,
      absent: 3,
      leave: 1,
      od: 1,
    },
  });

  return attendance;
}

interface Exam {
  name: string;
  startDate: string;
  endDate: string;
  time: string;
}

export function useExams() {
  const [exams] = useState<Exam[]>([
    {
      name: "Mid-Term Mathematics",
      startDate: "2024-04-18",
      endDate: "2024-04-20",
      time: "9:30 AM - 12:30 PM",
    },
    {
      name: "Science Quarterly",
      startDate: "2024-04-22",
      endDate: "2024-04-24",
      time: "9:30 AM - 12:30 PM",
    },
  ]);

  return exams;
}

export function useEvents() {
  const [events] = useState([
    {
      name: "Annual Sports Day",
      date: "2024-04-15",
      time: "9:00 AM",
      inCharge: "Mr. John Smith",
    },
    {
      name: "Science Exhibition",
      date: "2024-04-20",
      time: "10:00 AM",
      inCharge: "Mrs. Sarah Johnson",
    },
  ]);

  return events;
}
