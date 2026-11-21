import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileSpreadsheet, 
  TrendingUp, 
  Users, 
  School, 
  Filter,
  Search,
  ArrowUpDown
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { generateExcelReport } from '@/utils/excel';

interface SectionDetail {
  total: number;
  students: number;
}

interface ClassDetail {
  branch: string;
  class: string;
  total: number;
  studentCount: number;
  sectionBreakdown: Record<string, SectionDetail>;
}

interface ClassAnalysisProps {
  classWiseSummary: Record<string, ClassDetail>;
}

export const ClassAnalysis: React.FC<ClassAnalysisProps> = ({ classWiseSummary }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [selectedBranch, setSelectedBranch] = useState('all');

  const branches = useMemo(() => {
    const branchSet = new Set(Object.values(classWiseSummary).map(detail => detail.branch));
    return ['all', ...Array.from(branchSet)];
  }, [classWiseSummary]);

  const summaryStats = useMemo(() => {
    const stats = {
      totalCollection: 0,
      totalStudents: 0,
      averagePerStudent: 0,
      totalClasses: Object.keys(classWiseSummary).length
    };

    Object.values(classWiseSummary).forEach(detail => {
      stats.totalCollection += detail.total;
      stats.totalStudents += detail.studentCount;
    });

    stats.averagePerStudent = stats.totalCollection / stats.totalStudents;
    return stats;
  }, [classWiseSummary]);

  const handleExport = () => {
    const data = Object.entries(classWiseSummary).map(([, details]) => ({
      'Branch': details.branch,
      'Class': details.class,
      'Total Collection': details.total,
      'Student Count': details.studentCount,
      'Average/Student': details.total / details.studentCount
    }));
    
    generateExcelReport(data, 'Class Wise Report', 'class_wise_report');
  };

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredAndSortedData = useMemo(() => {
    return Object.entries(classWiseSummary)
      .filter(([, details]) => {
        const matchesSearch = (
          details.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
          details.class.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const matchesBranch = selectedBranch === 'all' || details.branch === selectedBranch;
        return matchesSearch && matchesBranch;
      })
      .sort(([, a], [, b]) => {
        if (!sortConfig.key) return 0;
        
        const aValue = sortConfig.key === 'averagePerStudent' 
          ? a.total / a.studentCount 
          : a[sortConfig.key as keyof ClassDetail];
        const bValue = sortConfig.key === 'averagePerStudent'
          ? b.total / b.studentCount
          : b[sortConfig.key as keyof ClassDetail];

        return sortConfig.direction === 'asc'
          ? (aValue < bValue ? -1 : 1)
          : (aValue > bValue ? -1 : 1);
      });
  }, [classWiseSummary, searchTerm, selectedBranch, sortConfig]);

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600">Total Collection</p>
                <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(summaryStats.totalCollection)}</h3>
              </div>
              <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">Total Students</p>
                <h3 className="text-2xl font-bold text-gray-900">{summaryStats.totalStudents}</h3>
              </div>
              <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Average per Student</p>
                <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(summaryStats.averagePerStudent)}</h3>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <School className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Classes</p>
                <h3 className="text-2xl font-bold text-gray-900">{summaryStats.totalClasses}</h3>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Filter className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="bg-white shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <CardTitle className="text-xl font-bold text-gray-900">Class-wise Collection Analysis</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex items-center gap-2 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border-green-200"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export to Excel
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by branch or class..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
              />
            </div>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-full md:w-48 bg-gray-50 border-gray-200">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map(branch => (
                  <SelectItem key={branch} value={branch}>
                    {branch === 'all' ? 'All Branches' : branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead 
                    onClick={() => handleSort('branch')} 
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      Branch
                      <ArrowUpDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </TableHead>
                  <TableHead 
                    onClick={() => handleSort('class')} 
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      Class
                      <ArrowUpDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </TableHead>
                  <TableHead 
                    onClick={() => handleSort('total')} 
                    className="text-right cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-end gap-2">
                      Total Collection
                      <ArrowUpDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </TableHead>
                  <TableHead 
                    onClick={() => handleSort('studentCount')} 
                    className="text-right cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-end gap-2">
                      Student Count
                      <ArrowUpDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </TableHead>
                  <TableHead>Section Details</TableHead>
                  <TableHead 
                    onClick={() => handleSort('averagePerStudent')} 
                    className="text-right cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-end gap-2">
                      Collection/Student
                      <ArrowUpDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.map(([id, details]) => (
                  <TableRow 
                    key={id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <TableCell className="font-medium text-gray-900">{details.branch}</TableCell>
                    <TableCell>{details.class}</TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      {formatCurrency(details.total)}
                    </TableCell>
                    <TableCell className="text-right">{details.studentCount}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {Object.entries(details.sectionBreakdown).map(([section, secDetails]) => (
                          <div 
                            key={`${id}-${section}`} 
                            className="text-sm p-2 rounded bg-gray-50 border border-gray-100"
                          >
                            <span className="font-medium text-gray-700">{section}:</span>
                            <span className="text-green-600 ml-2">{formatCurrency(secDetails.total)}</span>
                            <span className="text-gray-500 ml-2">({secDetails.students} students)</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-blue-600">
                      {formatCurrency(details.total / details.studentCount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassAnalysis;