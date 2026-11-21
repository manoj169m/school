"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Users2, Phone, Bus, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

// TypeScript interfaces
interface Student {
  id: number;
  name: string;
  rollNo: string;
  fatherContact: string;
  transportType: string;
  route: string;
  vehicleNumber: string;
  stop: string;
}

interface Section {
  id: number;
  name: string;
  students: Student[];
}

interface ClassInfo {
  id: number;
  name: string;
  acronym: string | null;
  totalStudents: number;
  sections: Section[];
}

interface TransportData {
  classes: ClassInfo[];
  totalStudents: number;
}

interface ClasswiseTransportCardProps {
  branchId?: number | "all";
  branchName?: string;
}

export function ClasswiseTransportCard({
  branchId = "all",
  branchName = "",
}: ClasswiseTransportCardProps) {
  const [selectedClass, setSelectedClass] = useState<number | undefined>(
    undefined
  );
  const [selectedSection, setSelectedSection] = useState<number | undefined>(
    undefined
  );
  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
  const [transportData, setTransportData] = useState<TransportData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransportData = async () => {
      try {
        setLoading(true);
        const url = `/api/transport/class-wise-transport${
          branchId !== "all" ? `?branchId=${branchId}` : ""
        }`;
        const response = await axios.get(url);
        setTransportData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching transport data:", err);
        setError("Failed to fetch transport data");
      } finally {
        setLoading(false);
      }
    };

    fetchTransportData();
  }, [branchId]); // Re-fetch when branchId changes

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "N/A";
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-red-500 to-rose-400 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32 bg-white/20" />
            <Skeleton className="h-4 w-24 bg-white/20" />
          </div>
          <GraduationCap className="h-8 w-8 opacity-50" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 bg-white/20 mt-2" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gradient-to-br from-red-500 to-rose-400 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            Error loading data
          </CardTitle>
          <GraduationCap className="h-8 w-8" />
        </CardHeader>
        <CardContent>
          <p className="text-white/80">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Dialog open={isClassDialogOpen} onOpenChange={setIsClassDialogOpen}>
        <DialogTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer"
          >
            <Card className="bg-gradient-to-br from-red-500 to-rose-400 text-white hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-bold">
                  {branchId === "all" ? (
                    "Class-wise Transport"
                  ) : (
                    <div className="flex flex-col">
                      <span>Class-wise Transport </span>
                      <span className="text-lg font-semibold text-white/90">
                        {branchName}
                      </span>
                    </div>
                  )}
                </CardTitle>
                <GraduationCap className="h-8 w-8" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">
                  {transportData?.totalStudents || 0}
                </div>
                <p className="text-sm text-white/80 mt-2">
                  Total students using transport
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600 mb-4">
              {branchId === "all" ? (
                ` Class-wise Transport Report - All Branches`
              ) : (
                <div className="flex flex-col">
                  <span>{branchName} </span>
                  <span className="text-lg font-semibold text-slate-800">
                    Click to show more details
                  </span>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[calc(100vh-200px)] pr-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-6">
              {transportData?.classes.map((classInfo, index) => (
                <Dialog
                  key={classInfo.id}
                  open={
                    selectedClass === classInfo.id ? isSectionDialogOpen : false
                  }
                  onOpenChange={(open) => {
                    setIsSectionDialogOpen(open);
                    if (!open) setSelectedClass(undefined);
                  }}
                >
                  <DialogTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="cursor-pointer"
                      onClick={() => setSelectedClass(classInfo.id)}
                    >
                      <Card className="bg-gradient-to-br from-indigo-50 to-white hover:shadow-md transition-all">
                        <CardContent className="p-4 text-center">
                          <GraduationCap className="h-8 w-8 mx-auto mb-2 text-red-600" />
                          <h3 className="font-bold text-lg mb-2">
                            Class {classInfo.name}
                          </h3>
                          <div className="flex items-center justify-center gap-2">
                            <Users2 className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {classInfo.totalStudents} students
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[800px]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl text-red-600 font-bold mb-4">
                        Class {classInfo.name} - Sections
                      </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-6">
                        {classInfo.sections.map((section, sectionIndex) => (
                          <Dialog
                            key={section.id}
                            open={selectedSection === section.id}
                            onOpenChange={(open) => {
                              if (!open) setSelectedSection(undefined);
                            }}
                          >
                            <DialogTrigger asChild>
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.3,
                                  delay: sectionIndex * 0.05,
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="cursor-pointer"
                                onClick={() => setSelectedSection(section.id)}
                              >
                                <Card className="bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition-all">
                                  <CardContent className="p-4 text-center">
                                    <h3 className="font-bold text-lg mb-2">
                                      Section {section.name}
                                    </h3>
                                    <div className="flex items-center justify-center gap-2">
                                      <Users2 className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm text-gray-600">
                                        {section.students.length} using
                                        transport
                                      </span>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-[800px]">
                              <DialogHeader>
                                <DialogTitle className="text-2xl text-red-600 font-bold mb-4">
                                  Class {classInfo.name} Section {section.name}{" "}
                                  - Transport Students
                                </DialogTitle>
                              </DialogHeader>
                              <ScrollArea className="h-[calc(100vh-300px)] pr-4">
                                <div className="space-y-4 pb-6">
                                  {section.students.map(
                                    (student, studentIndex) => (
                                      <motion.div
                                        key={student.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                          duration: 0.3,
                                          delay: studentIndex * 0.05,
                                        }}
                                      >
                                        <Card>
                                          <CardContent className="p-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                              <div>
                                                <h4 className="font-semibold text-lg">
                                                  {student.name}
                                                </h4>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                  <User className="h-4 w-4" />
                                                  <span>
                                                    Roll No: {student.rollNo}
                                                  </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                  <Phone className="h-4 w-4" />
                                                  <span>
                                                    Contact:{" "}
                                                    {formatPhoneNumber(
                                                      student.fatherContact
                                                    )}
                                                  </span>
                                                </div>
                                              </div>
                                              <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                  <Bus className="h-4 w-4 text-blue-500" />
                                                  <Badge
                                                    variant="outline"
                                                    className="bg-blue-50"
                                                  >
                                                    {student.vehicleNumber}
                                                  </Badge>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                  <span className="font-medium">
                                                    Route:
                                                  </span>{" "}
                                                  {student.route}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                  <span className="font-medium">
                                                    Stop:
                                                  </span>{" "}
                                                  {student.stop}
                                                </div>
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      </motion.div>
                                    )
                                  )}
                                </div>
                              </ScrollArea>
                            </DialogContent>
                          </Dialog>
                        ))}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ClasswiseTransportCard;
