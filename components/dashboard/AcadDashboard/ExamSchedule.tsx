import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Users } from 'lucide-react';
import { examSchedule } from './dashboard/exam-schedule';

const ExamSchedule = () => {
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Exam Schedule
          </CardTitle>
          <span className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
            {examSchedule.length} Upcoming
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {examSchedule.map((exam) => (
            <div key={exam.id} className={`${exam.bgColor} rounded-lg p-4 hover:shadow-md transition-all`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{exam.subject}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {exam.date}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${exam.color} bg-white`}>
                  {exam.examType}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {exam.time}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {exam.students} Students
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamSchedule;