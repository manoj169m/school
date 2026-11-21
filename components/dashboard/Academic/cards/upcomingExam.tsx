import React from "react";
import { Card } from "@/components/ui/card";
import { Calendar, BookCheck } from "lucide-react";

export function UpcomingExams() {
  const exams = [
    {
      date: "09",
      month: "Dec",
      title: "Cycle Test - 2",
      timing: "2 pm - 4 pm",
      duration: "2hrs",
      range: "11-12-2024 to 15-12-2024",
      audience: "1 std to 12 std",
    },
    {
      date: "10",
      month: "Dec",
      title: "II Mid Term",
      timing: "2 pm - 4 pm",
      duration: "2hrs",
      range: "11-12-2024 to 15-12-2024",
      audience: "1 std to 12 std",
    },
    {
      date: "11",
      month: "Dec",
      title: "Half yearly Exam",
      timing: "2 pm - 4 pm",
      duration: "2hrs",
      range: "11-12-2024 to 15-12-2024",
      audience: "1 std to 12 std",
    },
  ];

  return (
    <Card className="relative rounded-[10px] bg-custom-pink-50 p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <button className="flex items-center gap-2 bg-red-500 text-sm text-white px-4 py-1 rounded-md">
          <Calendar className="w-4 h-4" />
          Date Picker
        </button>
        <div className="flex items-center gap-2">
          <BookCheck className="w-4 h-4 text-red-700" />
          <h1 className="text-base font-bold text-gray-700">Upcoming Exams</h1>
        </div>
      </div>
      {exams.map((exam, index) => (
        <div key={index} className="flex gap-2 mb-3 flex-wrap sm:flex-nowrap">
          {/* Date Box */}
          <div className="flex flex-col items-center justify-center bg-custom-pink-300 text-white w-[45px]">
            <p className="text-lg font-bold">{exam.date}</p>
            <div className="w-[40px] h-[1px] bg-white"></div>
            <p className="text-lg font-bold">{exam.month}</p>
          </div>

          {/* Details Box */}
          <div className="flex-1 border border-custom-pink-300 p-4 rounded-lg flex flex-col gap-2 shadow-sm hover:shadow-xl transition-shadow duration-300">
            {/* Title and Audience */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <p className="text-base font-semibold text-red-900">
                {exam.title}
              </p>
              <p className="text-xs bg-red-800 text-custom-pink-100 px-2 py-1 rounded-sm mt-2 sm:mt-0 sm:inline-block w-fit">
                {exam.audience}
              </p>
            </div>

            {/* Timing and Range */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <p className="text-xs text-custom-pink-300 font-semibold">
                Timing: {exam.timing} Duration: {exam.duration}
              </p>
              <p className="flex items-center gap-2 text-xs text-custom-red-600 font-semibold mt-2 sm:mt-0">
                <Calendar className="w-4 h-4" />
                {exam.range}
              </p>
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
}
