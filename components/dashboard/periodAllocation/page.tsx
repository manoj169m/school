'use client';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CalendarCheck,
  CalendarCog,
  CalendarFold,
  Captions,
} from "lucide-react";
import ClassAllocation from './class-allocation';
import TeacherTimetable from './teacher-timetable';
import FreePeriodSummary from './free-period-summary';
import SubjectDistribution from './subject-distribution';
import QuotesSection from './quotes';

export default function DashboardPage() {

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=" mx-auto px-8 py-8"
      >
        
        <QuotesSection />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 grid gap-8"
        >
          <Tabs defaultValue="class" className="w-full">
            <TabsList className="grid w-full space-x-5 grid-cols-4">
              {[
                {
                  value: "class",
                  label: "Class Allocation",
                  icon: <CalendarFold className="w-4 h-4" />,
                  color: "from-emerald-500 to-teal-600",
                },
                {
                  value: "teacher",
                  label: "Teacher Timetable",
                  icon: <CalendarCheck className="w-4 h-4" />,
                  color: "from-amber-500 to-orange-600",
                },
                {
                  value: "free",
                  label: "Free Periods",
                  icon: <CalendarCog className="w-4 h-4" />,
                  color: "from-cyan-500 to-blue-600",
                },
                {
                  value: "subjects",
                  label: "Subject Distribution",
                  icon: <Captions className="w-4 h-4" />,
                  color: "from-rose-500 to-pink-600",
                },
              ].map(({ value, label, icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className={`group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
                    hover:bg-gradient-to-r hover:from-red-400 hover:to-red-600 hover:text-white
                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-400 data-[state=active]:to-red-600 data-[state=active]:text-white
                    data-[state=active]:shadow-lg transform hover:scale-105`}
                >
                  <span className="transform transition-transform group-hover:rotate-12">
                    {icon}
                  </span>
                  <span>{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent
              value="class"
              className="transition-all  mt-10 duration-500 animate-fade-up bg-white/80 backdrop-blur-lg rounded-xl shadow-xl p-4"
            >
              <ClassAllocation />
            </TabsContent>
            <TabsContent
              value="teacher"
              className="transition-all mt-10  duration-500 animate-fade-up bg-white/80 backdrop-blur-lg rounded-xl shadow-xl p-4"
            >
              <TeacherTimetable />
            </TabsContent>
            <TabsContent
              value="free"
              className="transition-all mt-10  duration-500 animate-fade-up bg-white/80 backdrop-blur-lg rounded-xl shadow-xl p-4"
            >
              <FreePeriodSummary />
            </TabsContent>
            <TabsContent
              value="subjects"
              className="transition-all mt-10  duration-500 animate-fade-up bg-white/80 backdrop-blur-lg rounded-xl shadow-xl p-4"
            >
              <SubjectDistribution />
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
}