import React, { useState, useCallback, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Sector, ResponsiveContainer, } from 'recharts';
import { format } from 'date-fns';
import { AlertCircle, CalendarIcon } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { PieDataDetails } from './StudentDashboard';
import { PieSectorDataItem } from 'recharts/types/polar/Pie';


interface PieDataItem {
  name: string;
  value: number;
  color: string;
  count: number;
  details?: PieDataDetails;
}

interface ChartDataItem {
  present: number;
  morningPresent: number;
  afternoonPresent: number;
  absent: number;
  leave: number;
  onDuty?: number;
}

interface AttendancePieChartProps {
  date: Date;
  branchId: string;
  onPieClick?: (entry: PieDataItem) => void;
}

const colorPalette = {
  present: 'hsl(150, 80%, 75%)',
  morningPresent: 'hsl(200, 80%, 75%)',
  afternoonPresent: 'hsl(35, 85%, 75%)',
  leave: 'hsl(270, 80%, 75%)',
  onDuty: 'hsl(270, 80%, 75%)',
  absent: 'hsl(0, 80%, 75%)'
} as const;

const AttendancePieChart: React.FC<AttendancePieChartProps> = ({
  date,
  branchId,
  onPieClick,
}) => {
  const [pieData, setPieData] = useState<PieDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

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
        const totals = calculateTotals(data.chartData);
        const totalStudents = Object.values(totals).reduce((a, b) => a + b, 0);
        const newPieData = createPieData(totals, totalStudents);
        
        setPieData(newPieData.filter(item => item.value > 0));
      } catch (err) {
        console.error('Error fetching attendance data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date, branchId]);

  const calculateTotals = (chartData: ChartDataItem[]) => ({
    present: chartData.reduce((acc, curr) => acc + curr.present, 0),
    morningPresent: chartData.reduce((acc, curr) => acc + curr.morningPresent, 0),
    afternoonPresent: chartData.reduce((acc, curr) => acc + curr.afternoonPresent, 0),
    absent: chartData.reduce((acc, curr) => acc + curr.absent, 0),
    leave: chartData.reduce((acc, curr) => acc + curr.leave, 0),
    onDuty: chartData.reduce((acc, curr) => acc + (curr.onDuty || 0), 0)
  });

  const createPieData = (totals: Record<string, number>, totalStudents: number): PieDataItem[] => [
    { 
      name: 'Present',
      value: Math.round((totals.present / totalStudents) * 100) || 0,
      color: colorPalette.present,
      count: totals.present
    },
    { 
      name: 'Morning Present',
      value: Math.round((totals.morningPresent / totalStudents) * 100) || 0,
      color: colorPalette.morningPresent,
      count: totals.morningPresent
    },
    { 
      name: 'Afternoon Present',
      value: Math.round((totals.afternoonPresent / totalStudents) * 100) || 0,
      color: colorPalette.afternoonPresent,
      count: totals.afternoonPresent
    },
    { 
      name: 'Leave',
      value: Math.round((totals.leave / totalStudents) * 100) || 0,
      color: colorPalette.leave,
      count: totals.leave
    },
    { 
      name: 'On Duty',
      value: Math.round((totals.onDuty / totalStudents) * 100) || 0,
      color: colorPalette.onDuty,
      count: totals.onDuty
    },
    { 
      name: 'Absent',
      value: Math.round((totals.absent / totalStudents) * 100) || 0,
      color: colorPalette.absent,
      count: totals.absent
    }
  ];

  const renderActiveShape = (props: PieSectorDataItem) => {
    const {
      cx = 0,
      cy = 0,
      innerRadius = 0,
      outerRadius = 0,
      startAngle = 0,
      endAngle = 0,
      fill,
      payload,
    } = props;

    return (
      <g>
        <text x={cx} y={cy - 10} textAnchor="middle" fill="black" className="text-sm font-medium">
          {payload.name}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="black" className="text-lg font-bold">
          {payload.value}%
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 1}
          outerRadius={outerRadius + 8}
          fill={fill}
        />
      </g>
    );
  };

  const onPieEnter = useCallback((_: PieDataItem, index: number) => {
    setActiveIndex(index);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="h-96 flex items-center justify-center">
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
        <CardContent className="h-96 flex items-center justify-center text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Distribution</CardTitle>
        <CardDescription className="flex items-center gap-2 mt-1">
          <CalendarIcon className="w-4 h-4" />
          {format(date, 'PPP')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
                onMouseEnter={onPieEnter}
                onClick={onPieClick}
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    style={{
                      filter: activeIndex === index ? 'brightness(1.1)' : 'none',
                      transition: 'filter 0.3s ease'
                    }}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ payload }) => {
                  if (payload?.[0]) {
                    const data = payload[0].payload as PieDataItem;
                    return (
                      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">{data.name}</p>
                        <p className="text-sm font-medium text-gray-600">Count: {data.count}</p>
                        <p className="text-sm font-medium text-gray-600">{data.value}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 bg-gray-50 p-3 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {pieData.map((entry, index) => (
              <div 
                key={index}
                className="flex items-center space-x-2 bg-white p-2 rounded-md hover:shadow-md transition-shadow duration-200 cursor-pointer"
              >
                <span
                  className="flex-shrink-0 w-3 h-3 rounded-sm"
                  style={{ backgroundColor: entry.color }}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-700 truncate block">
                    {entry.name}
                  </span>
                  <span className="text-xs text-gray-500 block">
                    {entry.count} ({entry.value}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendancePieChart;