import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, UserPlus, Bus, Home, Building2, Droplets, Users2 } from 'lucide-react';

interface StudentData {
  enrollmentId: number;
  enrollmentDate: string;
  hostelStatus: string;
  transportStatus: string;
  branch: { id: number; name: string };
  class: { id: number; name: string };
  section: { id: number; name: string };
  student: {
    id: number;
    firstName: string;
    lastName: string;
    admissionNo: string;
    rollNo: string;
    email: string;
    community: string;
    caste: string;
    bloodGroup: string;
    religion: string;
    address: string;
    gender: string;
  };
  status: string;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor?: string;
}

  const StatCard: React.FC<StatCardProps> = ({ title, value, icon, bgColor = "bg-rose-50" }) => (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-normal text-gray-500">{title}</p>
            <h3 className="text-2xl font-semibold mt-1">{value}</h3>
          </div>
          <div className={`${bgColor} p-2 rounded-lg`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const DistributionItem: React.FC<{
    label: string;
    value: number;
    total: number;
  }> = ({ label, value, total }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{label}</span>
        <div className="flex items-center gap-2">
          <span className="font-medium">{value}</span>
          <span className="text-sm text-gray-400">({((value / total) * 100).toFixed(1)}%)</span>
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-rose-400 rounded-full"
          style={{ width: `${(value / total) * 100}%` }}
        />
      </div>
    </div>
  );

  const DistributionCard: React.FC<{
    title: string;
    data: Record<string, number>;
    icon: React.ReactNode;
    total: number;
  }> = ({ title, data, icon, total }) => (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium text-gray-700">{title}</CardTitle>
        <div className="text-rose-400">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(data).map(([key, value]) => (
            <DistributionItem
              key={key}
              label={key}
              value={value}
              total={total}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const StudentAnalysisDashboard: React.FC<{ data: StudentData[] }> = ({ data }) => {
    const stats = useMemo(() => {
      const activeStudents = data.filter(s => s.status === 'Active').length;
      const inactiveStudents = data.filter(s => s.status === 'Inactive').length;
      const transportUsers = data.filter(s => s.transportStatus === 'Using').length;
      const hostelUsers = data.filter(s => s.hostelStatus === 'Using').length;

      const bloodGroupStats = data.reduce((acc, curr) => {
        const bg = curr.student.bloodGroup;
        acc[bg] = (acc[bg] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const communityStats = data.reduce((acc, curr) => {
        const community = curr.student.community;
        acc[community] = (acc[community] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const genderDistribution = data.reduce((acc, curr) => {
        const gender = curr.student.gender;
        acc[gender] = (acc[gender] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalStudents: data.length,
        activeStudents,
        inactiveStudents,
        transportUsers,
        hostelUsers,
        bloodGroupStats,
        communityStats,
        genderDistribution
      };
    }, [data]);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={<Users className="h-5 w-5 text-rose-400" />}
            bgColor="bg-rose-50"
          />
          <StatCard
            title="Active Students"
            value={stats.activeStudents}
            icon={<UserPlus className="h-5 w-5 text-green-500" />}
            bgColor="bg-green-50"
          />
          <StatCard
            title="Transport Users"
            value={stats.transportUsers}
            icon={<Bus className="h-5 w-5 text-blue-500" />}
            bgColor="bg-blue-50"
          />
          <StatCard
            title="Hostel Users"
            value={stats.hostelUsers}
            icon={<Home className="h-5 w-5 text-purple-500" />}
            bgColor="bg-purple-50"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <DistributionCard
            title="Community Distribution"
            data={stats.communityStats}
            icon={<Building2 className="h-5 w-5" />}
            total={stats.totalStudents}
          />
          
          <DistributionCard
            title="Blood Group Distribution"
            data={stats.bloodGroupStats}
            icon={<Droplets className="h-5 w-5" />}
            total={stats.totalStudents}
          />

          <DistributionCard
            title="Gender Distribution"
            data={stats.genderDistribution}
            icon={<Users2 className="h-5 w-5" />}
            total={stats.totalStudents}
          />
        </div>
      </div>
    );
  };

  export default StudentAnalysisDashboard;