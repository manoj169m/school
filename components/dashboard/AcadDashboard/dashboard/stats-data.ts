import { Users, BookOpenCheck, GraduationCap } from 'lucide-react';

export const statsData = [
  {
    title: "Total Students",
    count: "1,200",
    icon: Users,
    trend: "+5.2%",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "Active enrollments",
    previousCount: "1,142"
  },
  {
    title: "Question Bank",
    count: "250",
    icon: BookOpenCheck,
    trend: "+12.5%",
    color: "text-green-600",
    bgColor: "bg-green-50",
    description: "Verified questions",
    previousCount: "222"
  },
  {
    title: "Success Rate",
    count: "85%",
    icon: GraduationCap,
    trend: "+3.8%",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    description: "Average pass rate",
    previousCount: "81.2%"
  }
];