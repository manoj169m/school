import { Trophy, Medal, Award } from 'lucide-react';

export const toppers = [
  {
    id: 1,
    name: "Sarah Johnson",
    grade: "12th Grade",
    percentage: 98.5,
    rank: 1,
    subjects: ["Physics", "Mathematics"],
    improvement: "+2.3%",
    attendanceRate: "98%",
    badge: Trophy,
    badgeColor: "text-yellow-500",
    bgColor: "bg-yellow-50"
  },
  {
    id: 2,
    name: "Michael Chen",
    grade: "12th Grade",
    percentage: 97.8,
    rank: 2,
    subjects: ["Chemistry", "Biology"],
    improvement: "+1.8%",
    attendanceRate: "96%",
    badge: Medal,
    badgeColor: "text-gray-500",
    bgColor: "bg-gray-50"
  },
  {
    id: 3,
    name: "Emma Williams",
    grade: "12th Grade",
    percentage: 97.2,
    rank: 3,
    subjects: ["Mathematics", "Computer Science"],
    improvement: "+2.1%",
    attendanceRate: "95%",
    badge: Award,
    badgeColor: "text-orange-500",
    bgColor: "bg-orange-50"
  }
];