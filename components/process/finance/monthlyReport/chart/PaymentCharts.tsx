// components/payment/PaymentCharts.tsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { PaymentReportData } from "@/types/monthly";

interface PaymentChartsProps {
  data: PaymentReportData;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const PaymentCharts: React.FC<PaymentChartsProps> = ({ data }) => {
  // Prepare data for charts
  const dailyData = data.dailyCollections.map((day) => ({
    ...day,
    date: new Date(day.date).getDate(), // Convert to day of month
    formattedDate: new Date(day.date).toLocaleDateString("en-IN"),
  }));

  const weekdayData = Object.entries(data.statistics.weekdayPatterns).map(
    ([day, amount]) => ({
      name: weekdays[parseInt(day)],
      amount: amount,
    })
  );

  const paymentModeData = Object.entries(data.paymentModes).map(
    ([mode, details]) => ({
      name: mode,
      value: details.amount,
      count: details.count,
    })
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Daily Collections Trend */}
      <Card className="bg-gradient-to-br from-white to-blue-50 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-purple-800 bg-clip-text text-transparent">
            Daily Collections Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dailyData}
                margin={{ top: 20, right: 30, left: 65, bottom: 45 }}
              >
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="date"
                  label={{
                    value: "Day of Month",
                    position: "bottom",
                    fill: "#666",
                    offset: 20,
                  }}
                  tick={{ fill: "#666" }}
                  padding={{ left: 20, right: 20 }}
                />
                <YAxis
                  label={{
                    value: "Amount (₹)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#666",
                    offset: -20,
                  }}
                  tick={{ fill: "#666" }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  domain={[0, "auto"]}
                  padding={{ top: 20 }}
                />
                <Tooltip
                  formatter={(value: number) =>
                    `₹${value.toLocaleString("en-IN")}`
                  }
                  labelFormatter={(label) => `Day ${label}`}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{
                    paddingTop: "40px",
                    marginBottom: "-10px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#8884d8"
                  strokeWidth={3}
                  name="Collection Amount"
                  dot={false}
                  fill="url(#colorAmount)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Payment Mode Distribution */}
      <Card className="bg-gradient-to-br from-white to-rose-50 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
            Payment Mode Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={paymentModeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(1)}%`
                  }
                  labelLine={false}
                >
                  {paymentModeData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      className="hover:opacity-80 transition-opacity duration-300"
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) =>
                    `₹${value.toLocaleString("en-IN")}`
                  }
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Weekday Analysis */}
      <Card className="bg-gradient-to-br from-white to-blue-50 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-violet-800 bg-clip-text text-transparent">
            Collections by Weekday
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weekdayData}
                margin={{ top: 20, right: 30, left: 65, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  label={{
                    value: "Amount (₹)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#666",
                    offset: -20,
                  }}
                  tick={{ fill: "#666" }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  domain={[0, "auto"]}
                />
                <Tooltip
                  formatter={(value: number) =>
                    `₹${value.toLocaleString("en-IN")}`
                  }
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{
                    paddingTop: "30px",
                  }}
                />
                <Bar dataKey="amount" fill="#8884d8" name="Collection Amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Account-wise Distribution */}
      <Card className="bg-gradient-to-br from-white to-blue-50 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-800 to-green-800 bg-clip-text text-transparent">
            Account-wise Collections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={Object.entries(data.accountBreakdown).map(
                  ([name, amount]) => ({
                    name,
                    amount,
                  })
                )}
                layout="vertical"
              >
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={150} />
                <Tooltip
                  formatter={(value: number) =>
                    `₹${value.toLocaleString("en-IN")}`
                  }
                />
                <Legend />
                <Bar dataKey="amount" fill="#82ca9d" name="Collection Amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
