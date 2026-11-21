
import { Pie, PieChart, Cell, Tooltip, Legend, ResponsiveContainer, Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { CalendarIcon, Users, UserCheck, Clock, UserX,  } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { useState } from "react";
import { StaffStats } from "./StaffStatus";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
  
export default function StaffAttendanceDashboard() {
    const [date, setDate] = useState<Date>(new Date());
    const [selectedDepartment, setSelectedDepartment] = useState<string>("All Departments");
  
    // Sample stat data
    const stats = [
      {
        title: "Total Staff",
        value: "80",
        change: "+5% from last month",
        icon: <Users className="h-4 w-4 text-blue-500" />,
        trend: 'up' as const,
        department: "Across all departments"
      },
      {
        title: "Present Today",
        value: "75",
        change: "93.75% attendance rate",
        icon: <UserCheck className="h-4 w-4 text-green-500" />,
        trend: 'up' as const,
        department: "Across all departments"
      },
      {
        title: "Late Arrivals",
        value: "3",
        change: "3.75% of total staff",
        icon: <Clock className="h-4 w-4 text-yellow-500" />,
        trend: 'down' as const,
        department: "2 Teaching, 1 Admin"
      },
      {
        title: "On Leave",
        value: "2",
        change: "2.5% of total staff",
        icon: <UserX className="h-4 w-4 text-red-500" />,
        trend: 'down' as const,
        department: "1 Teaching, 1 Support"
      }
    ];
  
    // Pie chart data
    const pieData = [
      { name: "Teaching Staff", value: 45, color: "#2ECC71" },
      { name: "Administrative", value: 15, color: "#3498DB" },
      { name: "Support Staff", value: 20, color: "#9B59B6" }
    ];
  
    // Department-wise attendance data
    const departmentData = [
      { name: "Teaching", present: 42, late: 2, leave: 1 },
      { name: "Admin", present: 14, late: 1, leave: 0 },
      { name: "Support", present: 19, late: 0, leave: 1 }
    ];
  
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Staff Attendance Dashboard</h1>
            <p className="text-gray-600">Monitor and manage staff attendance</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[200px]">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {/* Department Select */}
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Departments">All Departments</SelectItem>
                <SelectItem value="Teaching">Teaching</SelectItem>
                <SelectItem value="Administrative">Administrative</SelectItem>
                <SelectItem value="Support">Support</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
  
        {/* Stats Section */}
        <StaffStats stats={stats} />
  
        {/* Charts Section */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
                <CardDescription>Staff distribution by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
  
          <div className="col-span-12 lg:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle>Department-wise Attendance</CardTitle>
                <CardDescription>Daily attendance breakdown by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="present" name="Present" fill="#2ECC71" />
                      <Bar dataKey="late" name="Late" fill="#F1C40F" />
                      <Bar dataKey="leave" name="On Leave" fill="#E74C3C" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
  