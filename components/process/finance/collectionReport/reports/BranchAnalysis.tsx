import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileSpreadsheet, 
  TrendingUp, 
  CreditCard, 
  Wallet, 
  Users,
  Search,
  ArrowUpDown 
} from 'lucide-react';
import { BranchSummary } from '@/types/payment/incomeReport';
import { formatCurrency } from '@/utils/formatters';
import { generateExcelReport } from '@/utils/excel';

interface BranchAnalysisProps {
  branchWiseSummary: Record<string, BranchSummary>;
}

export const BranchAnalysis: React.FC<BranchAnalysisProps> = ({ branchWiseSummary }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  const summaryStats = useMemo(() => {
    const stats = {
      totalCollection: 0,
      totalCash: 0,
      totalOnline: 0,
      totalStudents: 0,
    };

    Object.values(branchWiseSummary).forEach(details => {
      stats.totalCollection += details.total;
      stats.totalCash += details.cashTotal;
      stats.totalOnline += details.onlineTotal;
      stats.totalStudents += details.studentCount;
    });

    return stats;
  }, [branchWiseSummary]);

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleExport = () => {
    const data = Object.entries(branchWiseSummary).map(([branch, details]) => ({
      'Branch': branch,
      'Total Collection': details.total,
      'Cash Collection': details.cashTotal,
      'Online Collection': details.onlineTotal,
      'Student Count': details.studentCount,
      'Collection/Student': details.total / details.studentCount
    }));
    
    generateExcelReport(data, 'Branch Wise Report', 'branch_wise_report');
  };

  const filteredAndSortedData = useMemo(() => {
    return Object.entries(branchWiseSummary)
      .filter(([branch]) => 
        branch.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort(([branchA, a], [branchB, b]) => {
        if (!sortConfig.key) return 0;
        
        let aValue, bValue;
        
        switch(sortConfig.key) {
          case 'branch':
            [aValue, bValue] = [branchA, branchB];
            break;
          case 'averageCollection':
            [aValue, bValue] = [a.total / a.studentCount, b.total / b.studentCount];
            break;
          default:
            [aValue, bValue] = [a[sortConfig.key as keyof BranchSummary], b[sortConfig.key as keyof BranchSummary]];
        }

        return sortConfig.direction === 'asc'
          ? (aValue < bValue ? -1 : 1)
          : (aValue > bValue ? -1 : 1);
      });
  }, [branchWiseSummary, searchTerm, sortConfig]);

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600">Total Collection</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {formatCurrency(summaryStats.totalCollection)}
                </h3>
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
                <p className="text-sm font-medium text-emerald-600">Cash Collection</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {formatCurrency(summaryStats.totalCash)}
                </h3>
              </div>
              <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <Wallet className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Online Collection</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {formatCurrency(summaryStats.totalOnline)}
                </h3>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Students</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {summaryStats.totalStudents}
                </h3>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="bg-white shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <CardTitle className="text-xl font-bold text-gray-900">Branch-wise Collection Analysis</CardTitle>
          <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center gap-2 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border-green-200"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export to Excel
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search branches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
              />
            </div>
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
                    onClick={() => handleSort('total')} 
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      Total Collection
                      <ArrowUpDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </TableHead>
                  <TableHead 
                    onClick={() => handleSort('cashTotal')} 
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      Cash Collection
                      <ArrowUpDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </TableHead>
                  <TableHead 
                    onClick={() => handleSort('onlineTotal')} 
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      Online Collection
                      <ArrowUpDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </TableHead>
                  <TableHead 
                    onClick={() => handleSort('studentCount')} 
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      Student Count
                      <ArrowUpDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </TableHead>
                  <TableHead 
                    onClick={() => handleSort('averageCollection')} 
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      Collection/Student
                      <ArrowUpDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.map(([branch, details]) => {
                  const percentOnline = (details.onlineTotal / details.total) * 100;
                  const percentCash = (details.cashTotal / details.total) * 100;
                  
                  return (
                    <TableRow 
                      key={branch}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <TableCell className="font-medium text-gray-900">{branch}</TableCell>
                      <TableCell className="font-medium text-green-600">
                        {formatCurrency(details.total)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-emerald-600">
                            {formatCurrency(details.cashTotal)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {percentCash.toFixed(1)}%
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-blue-600">
                            {formatCurrency(details.onlineTotal)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {percentOnline.toFixed(1)}%
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{details.studentCount}</TableCell>
                      <TableCell className="font-medium text-indigo-600">
                        {formatCurrency(details.total / details.studentCount)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BranchAnalysis;