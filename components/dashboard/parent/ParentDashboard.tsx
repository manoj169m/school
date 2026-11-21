'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Book,
  Bell,
  Wallet,
  Calendar,
  Award,
  MessageCircle,
  MapPin,
  UserCheck,
  NotebookPen
} from 'lucide-react';
import DashboardCard from './DashboardCard';
import StudentCard from './StudentCard';
import DiarySection from './sections/DiarySection';
import AnnouncementsSection from './sections/AnnouncementsSection';
import AttendanceSection from './sections/AttendanceSection';
import ExamTimetableSection from './sections/ExamTimetableSection';
import ExamResultsSection from './sections/ExamResultsSection';

const modules = [
  { title: "Home Assignment", icon: Book, id: "diary", color: "rose-100" },
  { title: "Circular", icon: Bell, id: "announcements", color: "rose-200" },
  { title: "Fee Details", icon: Wallet, id: "finance", color: "rose-300" },
  
  { title: "Attendance", icon: UserCheck, id: "attendance", color: "rose-400" },
  {
    title: "Exam Time Table",
    icon: Calendar,
    id: "examTimetable",
    color: "rose-500",
  },
  { title: "Exam Results", icon: Award, id: "examResults", color: "rose-400" },
  {
    title: "Class Time Table",
    icon: NotebookPen,
    id: "finance",
    color: "rose-300",
  },
  {
    title: "Teacher Messages",
    icon: MessageCircle,
    id: "messages",
    color: "rose-300",
  },
  { title: "GPS Tracking", icon: MapPin, id: "gps", color: "rose-200" },
];

export default function ParentDashboard() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleCardClick = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  const handleBackToDashboard = () => {
    setActiveSection(null);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'diary':
        return <DiarySection onBack={handleBackToDashboard} />;
      case 'announcements':
        return <AnnouncementsSection onBack={handleBackToDashboard} />;
      case 'attendance':
        return <AttendanceSection onBack={handleBackToDashboard} />;
      case 'examTimetable':
        return <ExamTimetableSection onBack={handleBackToDashboard} />;
      case 'examResults':
        return <ExamResultsSection onBack={handleBackToDashboard} />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module, index) => (
              <DashboardCard
                key={module.title}
                title={module.title}
                icon={module.icon}
                onClick={() => handleCardClick(module.id)}
                delay={index * 0.1}
                color={module.color}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <StudentCard
          name="Lalitha Mary"
          class="10th"
          section="A"
          rollNo="123"
          imageUrl="https://images.unsplash.com/photo-1544717305-996b815c338c?q=80&w=200&h=200&fit=crop"
        />

        {renderContent()}
      </motion.div>
    </div>
  );
}