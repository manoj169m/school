"use client";

import { Card } from "@/components/ui/card";
import { useGradePerformance } from "@/hooks/overalldashboards";
import { Award, HelpCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

interface GradeData {
  grade: string;
  count: number;
  range: string;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: GradeData;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border">
        <p className="font-semibold flex items-center gap-2">
          <Award className="h-4 w-4 text-blue-500" />
          Grade {data.grade}
        </p>
        <p className="text-sm text-muted-foreground">Range: {data.range}%</p>
        <p className="text-sm font-medium">Students: {data.count}</p>
      </div>
    );
  }
  return null;
};

export function GradePerformanceChart() {
  const gradeData = useGradePerformance();

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Award className="h-4 w-4" />
            Grade-wise Performance
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <HelpCircle className="h-4 w-4" />
            <span>Hover over bars for details</span>
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gradeData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="grade" tick={{ fontSize: 12 }} tickLine={false} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                radius={[4, 4, 0, 0]}
                className="animate-in fade-in duration-1000"
              >
                {gradeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {gradeData.map((grade) => (
            <div
              key={grade.grade}
              className="p-3 rounded-lg bg-white/50 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">Grade {grade.grade}</span>
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: grade.color }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Range: {grade.range}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
