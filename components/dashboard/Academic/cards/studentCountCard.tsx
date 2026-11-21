"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { User, UserRound, Users } from "lucide-react";

export function StudentCountCard() {
  const [counts, setCounts] = useState({
    overallCount: 0,
    maleCount: 0,
    femaleCount: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch("/api/students/student-count");
        const data = await response.json();

        if (response.ok) {
          setCounts(data);
        } else {
          console.error("Error fetching counts:", data.error);
        }
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="flex flex-col space-y-5">
      {/* Students count */}
      <Card className="relative rounded-[10px] bg-white border p-6 shadow-md">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-red-800 font-bold text-xl">Students Count</div>
            <select className="flex items-center bg-transparent font-bold border border-red-800 text-red-800 px-7 py-1 rounded-md transition duration-300 focus:outline-none focus:ring-0">
              <option value="branch1">Branches</option>
              <option value="branch2">Branch 2</option>
              <option value="branch3">Branch 3</option>
            </select>
          </div>

          {/* Content */}
          <div className="flex flex-wrap xl:flex-nowrap justify-center gap-4">
            {/* Overall */}
            <div className="flex flex-col justify-between w-[200px] h-[120px] border border-red-200 rounded-md shadow-sm hover:shadow-lg transition-shadow duration-300 p-4 relative">
              <span className="text-red-800 font-bold text-lg">Overall</span>
              <span className="text-slate-600 text-sm block">
                Here is the active students:
              </span>
              <span className="text-red-600 font-extrabold text-2xl self-end">
                {counts.overallCount}
              </span>
              <Users className="absolute -top-3 -right-1 w-10 text-gray-700 bg-white p-1 rounded-full" />
            </div>

            {/* Male */}
            <div className="flex flex-col justify-between w-[200px] h-[120px] border border-red-200 rounded-md shadow-sm hover:shadow-lg transition-shadow duration-300 p-4 relative">
              <span className="text-red-800 font-bold text-lg">Boys</span>
              <span className="text-slate-600 text-sm block">
                Here is the Male students:
              </span>
              <span className="text-red-600 font-extrabold text-2xl self-end">
                {counts.maleCount}
              </span>
              <User className="absolute -top-3 -right-1 w-10 text-gray-700 bg-white p-1 rounded-full" />
            </div>

            {/* Female */}
            <div className="flex flex-col justify-between w-[200px] h-[120px] border border-red-200 rounded-md shadow-sm hover:shadow-lg transition-shadow duration-300 p-4 relative">
              <span className="text-red-800 font-bold text-lg">Girls</span>
              <span className="text-slate-600 text-sm block">
                Here is the Female students:
              </span>
              <span className="text-red-600 font-extrabold text-2xl self-end">
                {counts.femaleCount}
              </span>
              <UserRound className="absolute -top-3 -right-1 w-10 text-gray-700 bg-white p-1 rounded-full" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
