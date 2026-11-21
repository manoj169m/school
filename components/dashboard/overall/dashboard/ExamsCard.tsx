"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { BookOpen, Calendar, Clock } from "lucide-react";

import { ExamDetailsDialog } from "../dialogs/ExamDetailsDialog";
import { useExams } from "@/hooks/overalldashboards";

export function ExamsCard() {
  const exams = useExams();
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleExamClick = (examName: string) => {
    setSelectedExam(examName);
    setDialogOpen(true);
  };

  return (
    <>
      <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <BookOpen className="h-4 w-4" />
          Upcoming Exams
        </h3>
        <div className="space-y-4">
          {exams.map((exam, index) => (
            <Card
              key={index}
              className="p-4 bg-white/50 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer group animate-fade-in"
              onClick={() => handleExamClick(exam.name)}
            >
              <div className="space-y-3">
                <h4 className="font-semibold group-hover:text-blue-600 transition-colors">
                  {exam.name}
                </h4>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <span>{new Date(exam.startDate).toLocaleDateString()} - {new Date(exam.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>{exam.time}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <ExamDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        examName={selectedExam}
      />
    </>
  );
}