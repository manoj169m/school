import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet } from 'lucide-react';
import type { BranchMatrix } from '@/types/payment/incomeReport';
import { formatCurrency } from '@/utils/formatters';
import { generateExcelReport } from '@/utils/excel';

interface MatrixAnalysisProps {
  matrixSummary: Record<string, BranchMatrix>;
}

export const MatrixAnalysis: React.FC<MatrixAnalysisProps> = ({ matrixSummary }) => {
  const handleExport = () => {
    const data = Object.entries(matrixSummary).flatMap(([branch, branchDetails]) =>
      Object.entries(branchDetails.accounts).map(([account, accountDetails]) => ({
        'Branch': branch,
        'Account': account,
        'Total Collection': accountDetails.total,
        'Cash Collection': accountDetails.modes.cash,
        'Online Collection': accountDetails.modes.online,
        'Student Count': accountDetails.studentCount,
        'Average Per Student': accountDetails.total / accountDetails.studentCount,
        'Online Percentage': (accountDetails.modes.online / accountDetails.total * 100).toFixed(1) + '%',
        'Branch Total': branchDetails.total
      }))
    );
    
    generateExcelReport(data, 'Branch Account Matrix', 'branch_account_matrix');
  };

  // Calculate overall totals for comparison
  const overallTotals = React.useMemo(() => {
    const totals = {
      totalCollection: 0,
      cashCollection: 0,
      onlineCollection: 0,
      studentCount: 0
    };

    Object.values(matrixSummary).forEach(branch => {
      totals.totalCollection += branch.total;
      Object.values(branch.accounts).forEach(account => {
        totals.cashCollection += account.modes.cash;
        totals.onlineCollection += account.modes.online;
        totals.studentCount += account.studentCount;
      });
    });

    return totals;
  }, [matrixSummary]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Branch-Account Matrix Analysis</CardTitle>
          <div className="mt-2 text-sm text-gray-500">
            Total Collection: {formatCurrency(overallTotals.totalCollection)} | 
            Students: {overallTotals.studentCount} | 
            Online: {((overallTotals.onlineCollection / overallTotals.totalCollection) * 100).toFixed(1)}%
          </div>
        </div>
        <Button variant="outline" onClick={handleExport} className="gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(matrixSummary)
            .sort(([, a], [, b]) => b.total - a.total) // Sort branches by total collection
            .map(([branch, branchDetails]) => (
              <Card key={branch} className="bg-slate-50">
                <CardHeader className="py-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">
                      {branch}
                    </CardTitle>
                    <div className="text-sm text-gray-500">
                      {((branchDetails.total / overallTotals.totalCollection) * 100).toFixed(1)}% of total collection
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Account</TableHead>
                        <TableHead>Total Collection</TableHead>
                        <TableHead>Payment Modes</TableHead>
                        <TableHead>Student Stats</TableHead>
                        <TableHead>Share of Branch</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(branchDetails.accounts)
                        .sort(([, a], [, b]) => b.total - a.total) // Sort accounts by total collection
                        .map(([account, accountDetails]) => (
                          <TableRow key={account}>
                            <TableCell className="font-medium">{account}</TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div>{formatCurrency(accountDetails.total)}</div>
                                <div className="text-sm text-gray-500">
                                  ({((accountDetails.total / branchDetails.total) * 100).toFixed(1)}% of branch)
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="text-sm">
                                  Cash: {formatCurrency(accountDetails.modes.cash)}
                                  <span className="text-gray-500 ml-1">
                                    ({((accountDetails.modes.cash / accountDetails.total) * 100).toFixed(1)}%)
                                  </span>
                                </div>
                                <div className="text-sm">
                                  Online: {formatCurrency(accountDetails.modes.online)}
                                  <span className="text-gray-500 ml-1">
                                    ({((accountDetails.modes.online / accountDetails.total) * 100).toFixed(1)}%)
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div>{accountDetails.studentCount} students</div>
                                <div className="text-sm text-gray-500">
                                  ({formatCurrency(accountDetails.total / accountDetails.studentCount)} avg)
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium">
                                  {((accountDetails.total / branchDetails.total) * 100).toFixed(1)}%
                                </div>
                                <div className="text-xs text-gray-500">
                                  {((accountDetails.total / overallTotals.totalCollection) * 100).toFixed(1)}% of total
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      <TableRow className="bg-white">
                        <TableCell colSpan={2} className="font-medium">
                          Branch Total
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(branchDetails.total)}
                        </TableCell>
                        <TableCell colSpan={2} className="text-right text-gray-500">
                          {Object.keys(branchDetails.accounts).length} accounts
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MatrixAnalysis;