"use client";
import { useState } from "react";
import {
  MapPin,
  Bus,
  ChevronRight,
  Users,
  Phone,
  GraduationCap,
  Building2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Route } from "@/lib/transportDashboard/types/transport";
import { transportData } from "@/lib/transportDashboard/data/transport-data";


interface RouteStudent {
  id: number;
  name: string;
  gender: string;
  class: string;
  section: string;
  rollNo: string;
  address: string;
  routeName: string;
  stopName: string;
  busFee: number;
  paid: number;
  balance: number;
}

interface StopsListProps {
  route: Route;
}

interface StudentsListProps {
  students: RouteStudent[];
}

interface StopMap {
  [key: string]: RouteStudent[];
}

function BusRoutesManager() {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedStop, setSelectedStop] = useState<string | null>(null);
  const [isRoutesOpen, setIsRoutesOpen] = useState(false);
  const [isStopsOpen, setIsStopsOpen] = useState(false);
  const [isStudentsOpen, setIsStudentsOpen] = useState(false);

  function calculateTotalStops(): number {
    const stops = new Set<string>();
    transportData[0].routes.forEach((route: Route) => {
      route.students.forEach((student) => {
        stops.add(student.stopName);
      });
    });
    return stops.size;
  }

  // Main Card Component
  const MainCard = () => (
    <Dialog open={isRoutesOpen} onOpenChange={setIsRoutesOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer"
        >
          <Card className="bg-gradient-to-br  to-white hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Bus Stops</CardTitle>
              <MapPin className="h-8 w-8 " />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{calculateTotalStops()}</div>
              <p className="text-sm text-gray-600 mt-2">
                Designated pickup/drop points
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Active Routes & Stops
          </DialogTitle>
        </DialogHeader>
        <RoutesList />
      </DialogContent>
    </Dialog>
  );

  // Routes List Component
  const RoutesList = () => {
    const routes: Route[] = transportData[0].routes;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {routes.map((route, index) => {
          const uniqueStops = new Set(route.students.map((s) => s.stopName));
          return (
            <Dialog
              key={route.id}
              open={isStopsOpen && selectedRoute?.id === route.id}
              onOpenChange={(open) => {
                setIsStopsOpen(open);
                if (open) setSelectedRoute(route);
              }}
            >
              <DialogTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="cursor-pointer"
                >
                  <Card className="bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Bus className="h-6 w-6 text-blue-600" />
                          <div>
                            <h3 className="font-semibold text-lg">
                              {route.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {uniqueStops.size} stops
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[900px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    {route.name} - Stops
                  </DialogTitle>
                </DialogHeader>
                {selectedRoute && <StopsList route={selectedRoute} />}
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    );
  };

  // Stops List Component
  const StopsList = ({ route }: StopsListProps) => {
    const stopMap: StopMap = route.students.reduce((acc: StopMap, student) => {
      if (!acc[student.stopName]) {
        acc[student.stopName] = [];
      }
      acc[student.stopName].push(student);
      return acc;
    }, {});

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(stopMap).map(([stopName, students], index) => (
          <Dialog
            key={stopName}
            open={isStudentsOpen && selectedStop === stopName}
            onOpenChange={(open) => {
              setIsStudentsOpen(open);
              if (open) setSelectedStop(stopName);
            }}
          >
            <DialogTrigger asChild>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="cursor-pointer"
              >
                <Card className="bg-gradient-to-br from-green-50 to-white hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Users className="h-6 w-6 text-green-600" />
                        <div>
                          <h3 className="font-semibold text-lg">{stopName}</h3>
                          <p className="text-sm text-gray-600">
                            {students.length} students
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {stopName} - Students
                </DialogTitle>
              </DialogHeader>
              <StudentsList students={students} />
            </DialogContent>
          </Dialog>
        ))}
      </div>
    );
  };

  // Students List Component
  const StudentsList = ({ students }: StudentsListProps) => (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-4">
        {students.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="p-4">
                <h3 className="text-xl font-semibold mb-3">{student.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <GraduationCap className="h-4 w-4" />
                      <span>
                        Class {student.class} - Section {student.section}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>Address: {student.address}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {student.stopName} ({student.routeName})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building2 className="h-4 w-4" />
                      <span>
                        Fee Status: ₹{student.paid} / ₹{student.busFee}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-500">
                  Roll Number: {student.rollNo}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );

  return <MainCard />;
}

export default BusRoutesManager;
