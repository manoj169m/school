import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, CalendarClock} from 'lucide-react';
import { generateExcelReport } from '@/utils/excel';
import { formatCurrency } from '@/utils/formatters';

export interface TermSummary {
  total: number;
  cashTotal: number;
  onlineTotal: number;
  studentCount: number;
  pendingCount: number;
  completedCount: number;
  accountBreakdown: Record<string, number>;
  classBreakdown: Record<string, number>;
  dailyTrend: Record<string, number>;
}

interface TermAnalysisProps {
  termWiseSummary: Record<string, TermSummary>;
}

export const TermAnalysis: React.FC<TermAnalysisProps> = ({ termWiseSummary }) => {
  const accountTermData = useMemo(() => {
    const data: Record<string, { term: string; account: string; details: TermSummary }> = {};
    
    Object.entries(termWiseSummary).forEach(([term, termDetails]) => {
      Object.entries(termDetails.accountBreakdown).forEach(([account, amount]) => {
        const key = `${account}-${term}`;
        if (!data[key]) {
          data[key] = {
            term,
            account,
            details: {
              ...termDetails,
              total: amount, // Use the account-specific amount
              accountBreakdown: { [account]: amount }
            }
          };
        }
      });
    });

    return data;
  }, [termWiseSummary]);

  const handleExport = () => {
    const data = Object.entries(accountTermData).map(([, { term, account, details }]) => ({
      'Term': term,
      'Account': account,
      'Total Collection': details.total,
      'Cash Collection': details.cashTotal,
      'Online Collection': details.onlineTotal,
      'Student Count': details.studentCount,
      'Completed Payments': details.completedCount,
      'Pending Payments': details.pendingCount,
      'Completion Rate': `${((details.completedCount / details.studentCount) * 100).toFixed(1)}%`
    }));
    
    generateExcelReport(data, 'Account-Term Wise Analysis', 'account_term_wise_report');
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Account-Term Analysis
            </CardTitle>
            <p className="mt-1 text-sm text-gray-600">
              Comprehensive account and term-based collection analytics
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleExport} 
            className="gap-2 hover:bg-white/90 border-blue-200"
          >
            <FileSpreadsheet className="h-4 w-4 text-blue-600" />
            Export Report
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Account-Term Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Object.entries(accountTermData).map(([key, { term, account, details }]) => (
            <Card key={key} className="bg-white mt-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-700">{account}</h3>
                  <CalendarClock className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-sm text-gray-500 mb-3">Term: {term}</div>
                <div className="space-y-2">
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
        <Card>
          <CardHeader>
            <CardTitle>Account-Term Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Account</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead>Collections</TableHead>
                    <TableHead>Payment Methods</TableHead>
                    <TableHead>Students</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(accountTermData).map(([key, { term, account, details }]) => (
                    <TableRow key={key} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{account}</TableCell>
                      <TableCell>{term}</TableCell>
                      <TableCell>
                        <div className="font-semibold">{formatCurrency(details.total)}</div>
                        <div className="text-sm text-gray-500">
                          {formatCurrency(details.total / details.studentCount)} per student
                        </div>
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
                        <div className="font-medium">{details.studentCount}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default TermAnalysis;