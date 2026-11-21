import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,  ResponsiveContainer } from 'recharts';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  CalendarIcon, 
  Users,
  UserX,
  AlertCircle
} from 'lucide-react';

interface ChartDataItem {
  name: string;
  present: number;
  absent: number;
  morningPresent: number;
  afternoonPresent: number;
  leave: number;
  onDuty: number;
  total: number;
  totalSections?: number;
  markedSections?: number;
  holidaySections?: number;
  totalClasses?: number;
  markedClasses?: number;
  holidayClasses?: number;
  attendanceMarked: boolean;
}

interface ClassAttendanceChartProps {
  date: Date;
  branchId: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: {
    name: string;
    value: number;
    payload: ChartDataItem;
    color: string;
  }[];
  label?: string;
}

const ClassAttendanceChart: React.FC<ClassAttendanceChartProps> = ({ date, branchId }) => {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [viewType, setViewType] = useState<'branch' | 'class'>('class');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    posted: 0,
    presentPercentage: 0,
    absentPercentage: 0,
    totalStudents: 0
  });

  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-md border text-sm">
          <p className="font-semibold mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-muted-foreground">
              Total Students: {data.total}
            </p>
            {viewType === 'branch' ? (
              <p className="text-muted-foreground">
                Classes: {data.markedClasses ?? 0}/{data.totalClasses ?? 0}
                {(data.holidayClasses ?? 0) > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {data.holidayClasses} holiday
                  </Badge>
                )}
              </p>
            ) : (
              <p className="text-muted-foreground">
                Sections: {data.markedSections ?? 0}/{data.totalSections ?? 0}
                {(data.holidaySections ?? 0) > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {data.holidaySections} holiday
                  </Badge>
                )}
              </p>
            )}
            {payload.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: entry.color }}
                  />
                  {entry.name}
                </span>
                <span>{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const formattedDate = format(date, 'yyyy-MM-dd');
        
        const response = await fetch(
          `/api/attendance/class-wise?date=${formattedDate}&branchId=${branchId}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch attendance data');
        }
        
        const data = await response.json();
        setChartData(data.chartData);
        setViewType(data.viewType);

        const totalPresent = data.chartData.reduce((acc: number, curr: ChartDataItem) => 
          acc + curr.present + curr.morningPresent + curr.afternoonPresent, 0);
        const totalAbsent = data.chartData.reduce((acc: number, curr: ChartDataItem) => 
          acc + curr.absent, 0);
        const totalStudents = totalPresent + totalAbsent;

        setStats({
          total: data.viewType === 'branch' ? data.totalBranches : data.totalClasses,
          posted: data.attendancePosted,
          presentPercentage: Math.round((totalPresent / totalStudents) * 100) || 0,
          absentPercentage: Math.round((totalAbsent / totalStudents) * 100) || 0,
          totalStudents
        });
        
      } catch (err) {
        console.error('Error fetching attendance data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date, branchId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="h-[500px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-muted-foreground">Loading attendance data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="h-[500px] flex items-center justify-center text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>{viewType === 'branch' ? 'Branch-wise' : 'Class-wise'} Attendance</CardTitle>
          <CardDescription className="flex items-center gap-2 mt-1">
            <CalendarIcon className="w-4 h-4" />
            {format(date, 'PPP')}
          </CardDescription>
        </div>
        {stats.posted < stats.total && (
          <Badge variant="secondary">
            Pending: {stats.total - stats.posted}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {stats.posted < stats.total && (
          <Alert className="mb-4">
            <AlertDescription className="flex items-center gap-2">
              <UserX className="w-4 h-4" />
              Attendance pending for {stats.total - stats.posted} {viewType === 'branch' ? 'branches' : 'classes'}
            </AlertDescription>
          </Alert>
        )}
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              barSize={40}
              barGap={10}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215.4 16.3% 46.9%)', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215.4 16.3% 46.9%)', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="present" stackId="a" fill="hsl(150, 80%, 75%)" />
              <Bar dataKey="morningPresent" stackId="a" fill="hsl(200, 80%, 75%)" />
              <Bar dataKey="afternoonPresent" stackId="a" fill="hsl(35, 85%, 75%)" />
              <Bar dataKey="leave" stackId="a" fill="hsl(270, 80%, 75%)" />
              <Bar dataKey="absent" stackId="a" fill="hsl(0, 80%, 75%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              Total Students: {stats.totalStudents.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              Present: {stats.presentPercentage}%
            </Badge>
            <Badge variant="secondary">
              Absent: {stats.absentPercentage}%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassAttendanceChart;