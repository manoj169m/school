'use client';
import React, { useState } from "react";
import Academic from "@/components/dashboard/Academic/Academic";
import CombinedDashboard from "@/components/dashboard/Attendance/CombinedDashboard";
import Finance from "@/components/dashboard/Finance/Finance";
import ParentDashboard from "@/components/dashboard/parent/ParentDashboard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Layout,
  Layers,
  Calendar,
  DollarSign,
  Bus,
  Clock,
  Home,
  Users,
  LineChart,
  BookOpen,
} from "lucide-react";
import OverAllDashboard from "@/components/dashboard/overall/overAllPage";
import Performance from "@/components/dashboard/performance/Performance";
import AcadDashboard from "@/components/dashboard/AcadDashboard/AcadDasnboard";
import { TransportDashboard } from "@/components/dashboard/transport/transport-dashboard";
import HostelDashboard from "@/components/dashboard/hostel/HostelDashboard";
import DashboardPage from "@/components/dashboard/periodAllocation/page";

interface DashboardSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  component: React.ReactNode;
}

function Dashboard() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [api, setApi] = useState<CarouselApi>();

  React.useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      setActiveIndex(api.selectedScrollSnap());
    });
  }, [api]);

  const dashboardSections: DashboardSection[] = [
    {
      id: "overall",
      label: "Overall",
      icon: <Layout className="w-4 h-4" />,
      color: "bg-gradient-to-r from-fuchsia-500 to-pink-600",
      component: <OverAllDashboard />,
    },
    {
      id: "academic",
      label: "Academic",
      icon: <BookOpen className="w-4 h-4" />,
      color: "bg-gradient-to-r from-emerald-500 to-teal-600",
      component: <Academic />,
    },
    {
      id: "attendance",
      label: "Attendance",
      icon: <Calendar className="w-4 h-4" />,
      color: "bg-gradient-to-r from-amber-500 to-orange-600",
      component: <CombinedDashboard />,
    },
    {
      id: "finance",
      label: "Finance",
      icon: <DollarSign className="w-4 h-4" />,
      color: "bg-gradient-to-r from-cyan-500 to-blue-600",
      component: <Finance />,
    },
    {
      id: "hostel",
      label: "Hostel",
      icon: <Home className="w-4 h-4" />,
      color: "bg-gradient-to-r from-lime-500 to-green-600",
      component: <HostelDashboard />,
    },
    {
      id: "period-allocation",
      label: "Period Allocation",
      icon: <Clock className="w-4 h-4" />,
      color: "bg-gradient-to-r from-violet-500 to-purple-600",
      component: <DashboardPage />,
    },
    {
      id: "student",
      label: "Student",
      icon: <Users className="w-4 h-4" />,
      color: "bg-gradient-to-r from-amber-500 to-yellow-600",
      component: <ParentDashboard />,
    },
    {
      id: "progressCard",
      label: "Progress Card",
      icon: <LineChart className="w-4 h-4" />,
      color: "bg-gradient-to-r from-sky-500 to-indigo-600",
      component: <Performance />,
    },
    {
      id: "transport",
      label: "Transport",
      icon: <Bus className="w-4 h-4" />,
      color: "bg-gradient-to-r from-rose-500 to-pink-600",
      component: <TransportDashboard />
    },
    {
      id: "acadDash",
      label: "Courses",
      icon: <Layers className="w-4 h-4" />,
      color: "bg-gradient-to-r from-emerald-500 to-green-600",
      component: <AcadDashboard />,
    },
  ];

  const handleNavClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  return (
    <div className="bg-gradient-to-br from-custom-pink-50 via-custom-gray-50 to-custom-pink-100 ">
      <div className="px-4 py-8 flex flex-col">
        <div className="mx-auto w-full">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-custom-pink-400 to-custom-pink-300 mb-8 text-center">
            Welcome to ERP Dashboard
          </h1>

          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-4 mb-8">
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2">
              {dashboardSections.map(({ id, label, icon, color }, index) => (
                <button
                  key={id}
                  onClick={() => handleNavClick(index)}
                  className={`${
                    activeIndex === index ? color : "bg-gray-50"
                  } ${
                    activeIndex === index ? "text-white" : "text-gray-700"
                  } flex items-center justify-center md:justify-start gap-2 px-3 py-2 rounded-lg transition-all duration-300
                  hover:shadow-md transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-pink-500`}
                >
                  <span className="transform transition-transform group-hover:rotate-12">
                    {icon}
                  </span>
                  <span className="hidden md:inline text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex-1 h-full">
            <Carousel
              setApi={setApi}
              className="w-full h-full"
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent className="h-full ">
                {dashboardSections.map(({ id, component }) => (
                  <CarouselItem key={id} className="h-[calc(100vh-16rem)] overflow-y-auto custom-scrollbar">
                    <div className="h-full rounded-2xl  transition-all duration-300 p-2">
                      {component}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="bg-white/90 hover:bg-white -left-4 h-12 w-12 border-2" />
              <CarouselNext className="bg-white/90 hover:bg-white -right-4 h-12 w-12 border-2" />
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return <Dashboard />;
}