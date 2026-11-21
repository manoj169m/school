"use client";
import { GradePerformanceChart } from "./GradePerformanceChart";

export function PerformanceChart() {
  // const performanceData = usePerformance();

  return (
    <div className="space-y-6">
      {/* <Card className="p-6 bg-gradient-to-br from-green-500/10 to-blue-500/10">
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <TrendingUp className="h-4 w-4" />
          Performance Overview
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <Bar dataKey="value" fill="#4f46e5">
                {performanceData.map((entry, index) => (
                  <Cell key={index} fill={`hsl(${index * 120}, 70%, 50%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card> */}

      <GradePerformanceChart />
    </div>
  );
}