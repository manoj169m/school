import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, TrendingUp, Users, Wallet } from 'lucide-react';
import type { AccountSummary } from '@/types/payment/incomeReport';
import { formatCurrency } from '@/utils/formatters';
import { generateExcelReport } from '@/utils/excel';

interface AccountAnalysisProps {
  accountWiseSummary: Record<string, AccountSummary>;
}

export const AccountAnalysis: React.FC<AccountAnalysisProps> = ({ accountWiseSummary }) => {
  const handleExport = () => {
    const data = Object.entries(accountWiseSummary).map(([account, details]) => ({
      'Account': account,
      'Total Collection': details.total,
      'Cash Collection': details.cashTotal,
      'Online Collection': details.onlineTotal,
      'Student Count': details.studentCount,
      'Average Per Student': details.total / details.studentCount
    }));
    
    generateExcelReport(data, 'Account Wise Report', 'account_wise_report');
  };

  const getTrendIndicator = (trend: Record<string, number>) => {
    const sortedMonths = Object.entries(trend)
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
    
    if (sortedMonths.length >= 2) {
      const [latest, previous] = sortedMonths;
      return latest[1] > previous[1] ? 'text-green-500' : 'text-red-500';
    }
    return 'text-gray-500';
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Financial Analytics Dashboard
            </CardTitle>
            <p className="mt-1 text-sm text-gray-600">Comprehensive financial metrics and collection analysis</p>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={handleExport} 
              className="gap-2 hover:bg-white/90 border-blue-200"
            >
              <FileSpreadsheet className="h-4 w-4 text-blue-600" />
              Export Report
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Account Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Object.entries(accountWiseSummary).map(([account, details]) => (
              <Card key={account} className="bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-700">{account}</h3>
                    <Wallet className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Total Collection</span>
                      <span className="font-medium">{formatCurrency(details.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Students</span>
                      <span className="font-medium">{details.studentCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Table */}
          <div className="rounded-lg border bg-white">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="w-[200px]">Account</TableHead>
                    <TableHead>Collections</TableHead>
                    <TableHead>Payment Methods</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Branch Distribution</TableHead>
                    <TableHead>Monthly Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(accountWiseSummary).map(([account, details]) => (
                    <TableRow key={account} className="hover:bg-gray-50/50">
                      <TableCell className="font-medium">{account}</TableCell>
                      <TableCell>
                        <div className="font-semibold">{formatCurrency(details.total)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Cash</span>
                            <div className="flex items-center space-x-2">
                              <div className="h-2 w-24 rounded-full bg-gray-200">
                                <div 
                                  className="h-2 rounded-full bg-blue-500" 
                                  style={{ width: `${(details.cashTotal / details.total) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">
                                {((details.cashTotal / details.total) * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Online</span>
                            <div className="flex items-center space-x-2">
                              <div className="h-2 w-24 rounded-full bg-gray-200">
                                <div 
                                  className="h-2 rounded-full bg-green-500" 
                                  style={{ width: `${(details.onlineTotal / details.total) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">
                                {((details.onlineTotal / details.total) * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{details.studentCount}</span>
                          <span className="text-sm text-gray-500">
                            ({formatCurrency(details.total / details.studentCount)} avg)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                          {Object.entries(details.branchBreakdown)
                            .sort((a, b) => b[1] - a[1])
                            .map(([branch, amount]) => (
                              <div key={branch} className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">{branch}</span>
                                <span className="font-medium">
                                  {((amount / details.total) * 100).toFixed(1)}%
                                </span>
                              </div>
                            ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {Object.entries(details.monthlyTrend)
                            .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
                            .slice(0, 3)
                            .map(([month, amount], index) => (
                              <div key={month} className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">{month}</span>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{formatCurrency(amount)}</span>
                                  {index === 0 && (
                                    <TrendingUp className={`h-4 w-4 ${getTrendIndicator(details.monthlyTrend)}`} />
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountAnalysis;