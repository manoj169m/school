import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, BookOpen, Clock, Users, MapPin, GraduationCap, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Exam } from './UpdateSheetModel';

interface ExamViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  examData: Exam | null;
}

export function ExamViewDialog({ isOpen, onClose, examData }: ExamViewDialogProps) {
  if (!examData) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const getStatusConfig = () => {
    const now = new Date();
    const startDate = new Date(examData.startDate);
    const endDate = new Date(examData.endDate);

    if (now < startDate) return { color: "bg-amber-100 text-amber-700", status: "Upcoming" };
    if (now > endDate) return { color: "bg-emerald-100 text-emerald-700", status: "Completed" };
    return { color: "bg-sky-100 text-sky-700", status: "In Progress" };
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto rounded-xl p-0">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8" />
              <DialogTitle className="text-2xl font-semibold">
                {examData.name}
              </DialogTitle>
            </div>
            <Badge className={`${getStatusConfig().color} px-3 py-1 rounded-full text-sm font-medium`}>
              {getStatusConfig().status}
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="flex items-center gap-2 text-white/90">
              <Clock className="h-5 w-5" />
              <div>
                <p className="text-sm opacity-75">Duration</p>
                <p className="font-medium">{formatDate(examData.startDate)} - {formatDate(examData.endDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="h-5 w-5" />
              <div>
                <p className="text-sm opacity-75">Branch</p>
                <p className="font-medium">{examData.branch.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Users className="h-5 w-5" />
              <div>
                <p className="text-sm opacity-75">Class & Section</p>
                <p className="font-medium">{examData.class.name} - {examData.section.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects Table */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-800">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              <h3 className="font-semibold">Subject Schedule</h3>
            </div>
            <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200">
              {examData.subjects.length} Subjects
            </Badge>
          </div>

          <div className="rounded-lg border border-gray-100 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-medium text-gray-600">Subject</TableHead>
                  <TableHead className="font-medium text-gray-600">Schedule</TableHead>
                  <TableHead className="font-medium text-gray-600">Duration</TableHead>
                  <TableHead className="font-medium text-gray-600">Marks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {examData.subjects.map((subject) => (
                  <TableRow 
                    key={subject.id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="font-medium text-gray-700">{subject.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(subject.examDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(subject.startTime)} - {formatTime(subject.endTime)}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-indigo-50 text-indigo-600 border-0">
                        {subject.duration} min
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-red-600">Min: {subject.minMarks}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-emerald-600">Max: {subject.maxMarks}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}