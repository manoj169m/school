import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface StudentData {
  enrollmentId: number;
  student: {
    gender: string;
    caste: string;
    bloodGroup: string;
  };
}

interface AnalysisTable {
  category: string;
  count: number;
  percentage: string;
}

const AnalyticsTable: React.FC<{
  title: string;
  data: AnalysisTable[];
  onExport: () => void;
}> = ({ title, data, onExport }) => (
  <Card className="border-0 shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-base font-medium text-gray-700">{title}</CardTitle>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onExport}
        className="text-rose-500 border-rose-200 hover:bg-rose-50"
      >
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Count</TableHead>
            <TableHead className="text-right">Percentage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{row.category}</TableCell>
              <TableCell className="text-right">{row.count}</TableCell>
              <TableCell className="text-right">{row.percentage}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const StudentAnalyticsTables: React.FC<{ data: StudentData[] }> = ({ data }) => {
  const analytics = useMemo(() => {
    const total = data.length;
    
    // Gender Analysis
    const genderCount = data.reduce((acc, curr) => {
      const gender = curr.student.gender;
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const genderData = Object.entries(genderCount).map(([gender, count]) => ({
      category: gender,
      count,
      percentage: `${((count / total) * 100).toFixed(1)}%`
    }));

    // Caste Analysis
    const casteCount = data.reduce((acc, curr) => {
      const caste = curr.student.caste;
      acc[caste] = (acc[caste] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const casteData = Object.entries(casteCount).map(([caste, count]) => ({
      category: caste,
      count,
      percentage: `${((count / total) * 100).toFixed(1)}%`
    }));

    // Blood Group Analysis
    const bloodGroupCount = data.reduce((acc, curr) => {
      const bloodGroup = curr.student.bloodGroup;
      acc[bloodGroup] = (acc[bloodGroup] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const bloodGroupData = Object.entries(bloodGroupCount).map(([bloodGroup, count]) => ({
      category: bloodGroup,
      count,
      percentage: `${((count / total) * 100).toFixed(1)}%`
    }));

    return {
      genderData,
      casteData,
      bloodGroupData
    };
  }, [data]);

  const exportToExcel = (data: AnalysisTable[], filename: string) => {
    // Convert data to CSV format
    const headers = ['Category', 'Count', 'Percentage'];
    const csvData = [
      headers.join(','),
      ...data.map(row => [
        row.category,
        row.count,
        row.percentage
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <AnalyticsTable
          title="Gender Analysis"
          data={analytics.genderData}
          onExport={() => exportToExcel(analytics.genderData, 'gender_analysis')}
        />
        
        <AnalyticsTable
          title="Caste Analysis"
          data={analytics.casteData}
          onExport={() => exportToExcel(analytics.casteData, 'caste_analysis')}
        />
        
        <AnalyticsTable
          title="Blood Group Analysis"
          data={analytics.bloodGroupData}
          onExport={() => exportToExcel(analytics.bloodGroupData, 'blood_group_analysis')}
        />
      </div>
    </div>
  );
};

export default StudentAnalyticsTables;