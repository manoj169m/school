"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { BookOpen, Calendar, Clock, GraduationCap } from "lucide-react";

interface ExamDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  examName: string | null;
}

export function ExamDetailsDialog({ open, onOpenChange, examName }: ExamDetailsDialogProps) {
  const examDetails = {
    "Mid-Term Mathematics": {
      subjects: [
        {
          name: "Algebra",
          date: "2024-04-18",
          startTime: "9:30 AM",
          endTime: "12:30 PM",
          venue: "Main Hall Block A",
          examiner: "Mrs. Sarah Johnson"
        },
        {
          name: "Geometry",
          date: "2024-04-19",
          startTime: "9:30 AM",
          endTime: "12:30 PM",
          venue: "Main Hall Block B",
          examiner: "Mr. John Smith"
        },
        {
          name: "Trigonometry",
          date: "2024-04-20",
          startTime: "9:30 AM",
          endTime: "12:30 PM",
          venue: "Main Hall Block A",
          examiner: "Mr. David Wilson"
        }
      ],
      instructions: [
        "Bring geometric instruments",
        "Scientific calculator allowed",
        "Graph paper will be provided",
        "Show all working clearly"
      ]
    },
    "Science Quarterly": {
      subjects: [
        {
          name: "Physics",
          date: "2024-04-22",
          startTime: "9:30 AM",
          endTime: "12:30 PM",
          venue: "Science Block Lab 1",
          examiner: "Dr. Robert Brown"
        },
        {
          name: "Chemistry",
          date: "2024-04-23",
          startTime: "9:30 AM",
          endTime: "12:30 PM",
          venue: "Science Block Lab 2",
          examiner: "Dr. Emily White"
        },
        {
          name: "Biology",
          date: "2024-04-24",
          startTime: "9:30 AM",
          endTime: "12:30 PM",
          venue: "Science Block Lab 3",
          examiner: "Dr. Michael Green"
        }
      ],
      instructions: [
        "Lab coat mandatory",
        "No calculators allowed",
        "Practical component included",
        "Answer all questions"
      ]
    }
  };

  const currentExam = examName ? examDetails[examName as keyof typeof examDetails] : null;

  if (!currentExam) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-500" />
            {examName} Schedule
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentExam.subjects.map((subject, index) => (
              <Card
                key={index}
                className="p-4 hover:shadow-lg transition-all duration-300 animate-fade-in bg-gradient-to-br from-blue-500/5 to-purple-500/5"
              >
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-purple-500" />
                    {subject.name}
                  </h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-500" />
                      <span>{new Date(subject.date).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>{subject.startTime} - {subject.endTime}</span>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <p className="text-muted-foreground">Venue: {subject.venue}</p>
                      <p className="text-muted-foreground">Examiner: {subject.examiner}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-4 bg-gradient-to-br from-yellow-500/5 to-orange-500/5">
            <h4 className="font-semibold mb-2">Important Instructions</h4>
            <ul className="list-disc list-inside space-y-1">
              {currentExam.instructions.map((instruction, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {instruction}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}