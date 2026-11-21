"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { BookOpen, Clock, Calendar } from "lucide-react";

interface ExamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExamDialog({ open, onOpenChange }: ExamDialogProps) {
  const exams = [
    {
      name: "Mid-Term Mathematics",
      date: "2024-04-18",
      time: "9:30 AM",
      duration: "3 hours",
      venue: "Main Hall",
      syllabus: [
        "Algebra",
        "Trigonometry",
        "Calculus",
        "Geometry",
      ],
      instructions: [
        "Bring geometric instruments",
        "Scientific calculator allowed",
        "Show all working",
      ],
    },
    {
      name: "Science Quarterly",
      date: "2024-04-22",
      time: "10:00 AM",
      duration: "2.5 hours",
      venue: "Science Block",
      syllabus: [
        "Physics - Mechanics",
        "Chemistry - Organic",
        "Biology - Genetics",
      ],
      instructions: [
        "Lab coat mandatory",
        "No calculators allowed",
        "Practical component included",
      ],
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">Upcoming Examinations</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-6">
          {exams.map((exam, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-all duration-300 animate-fade-in"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    {exam.name}
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-green-500" />
                      <span className="text-sm">
                        {new Date(exam.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">{exam.time}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Syllabus Coverage</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {exam.syllabus.map((topic, idx) => (
                          <li key={idx} className="text-sm">{topic}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Instructions</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {exam.instructions.map((instruction, idx) => (
                          <li key={idx} className="text-sm">{instruction}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                  <div>
                    <span className="text-sm font-semibold">Duration:</span>
                    <span className="text-sm ml-2">{exam.duration}</span>
                  </div>
                  <div>
                    <span className="text-sm font-semibold">Venue:</span>
                    <span className="text-sm ml-2">{exam.venue}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}