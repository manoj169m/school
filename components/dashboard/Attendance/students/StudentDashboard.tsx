'use client';
import React, { useState, useEffect } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Stat, StudentStats } from "./AttendanceStatus";
import AttendancePieChart from "./StutendPieChart";
import ClassAttendanceChart from "./StudentBarChart";

export interface PieDataDetails {
  trend: number;
  previousValue: number;
  breakdown: Array<{ class: string; count: number }>;
}
interface PieDataItem {
  name: string;
  value: number;
  color: string;
  details?: PieDataDetails;
}

interface Branch {
  id: number;
  name: string;
  acronym: string;
}

export default function AttendanceDashboard() {
  const [date, setDate] = useState<Date>(new Date());
  const [branches, setBranches] = useState<Branch[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<PieDataItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stat[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('all');

  // Fetch branches on component mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get('/api/branches');
        setBranches(response.data);
        // Set 'all' as default
        setSelectedBranch('all');
      } catch (err) {
        console.error('Error fetching branches:', err);
        setError('Failed to fetch branches');
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  // Fetch attendance stats when date or branch changes
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Format date as required by the API (DD-MM-YYYY HH:mm:ss)
        const formattedDate = format(date, 'dd-MM-yyyy HH:mm:ss');
        const response = await axios.get('/api/attendance/daily', {
          params: {
            date: formattedDate,
            branchId: selectedBranch,
          },
        });
        setStats(response.data.stats);
      } catch (err) {
        console.error('Error fetching attendance stats:', err);
        setError('Failed to fetch attendance stats');
      }
    };

    fetchStats();
  }, [date, selectedBranch]);

  console.log(stats);
  

  const handlePieClick = (data: PieDataItem): void => {
    setSelectedData(data);
    setDialogOpen(true);
  };

  const handleDateSelect = (selectedDate: Date | undefined): void => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          {/* <h1 className="text-2xl font-bold text-gray-900">Attendance Dashboard</h1>
          <p className="text-gray-600">Monitor and manage student attendance</p> */}
        </div>
        <div className="flex items-center gap-4">
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
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Select 
    value={selectedBranch} 
    onValueChange={handleBranchChange}
  >
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Select branch" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gray-500" />
          All Branches
        </div>
      </SelectItem>
      {branches.map((branch) => (
        <SelectItem key={branch.id} value={branch.id.toString()}>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            {branch.acronym}
          </div>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && <StudentStats stats={stats} />}

      {/* Charts */}
      <div className="grid grid-cols-12 gap-6">
        {/* Pie Chart Card */}
        <div className="col-span-12 lg:col-span-4">
         
              {selectedBranch && (
                <AttendancePieChart
                  date={date}
                  branchId={selectedBranch}
                  onPieClick={handlePieClick}
                />
              )}
           
        </div>

        {/* Bar Chart Card */}
        <div className="col-span-12 lg:col-span-8">
          {selectedBranch && (
            <ClassAttendanceChart
              date={date}
              branchId={selectedBranch}
            />
          )}
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: selectedData?.color }}
              />
              {selectedData?.name} Students
            </DialogTitle>
            <DialogDescription>
        Detailed breakdown of {selectedData?.name.toLowerCase()} students&apos; attendance.
      </DialogDescription>
          </DialogHeader>
          {selectedData?.details && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedData.details.breakdown.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.class}</TableCell>
                    <TableCell>{item.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}