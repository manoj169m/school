import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet } from 'lucide-react';
import type { CollectorSummary } from '@/types/payment/incomeReport';
import { formatCurrency } from '@/utils/formatters';
import { generateExcelReport } from '@/utils/excel';

interface CollectorAnalysisProps {
  collectorWiseSummary: Record<string, CollectorSummary>;
}

export const CollectorAnalysis: React.FC<CollectorAnalysisProps> = ({ collectorWiseSummary }) => {
  const handleExport = () => {
    const data = Object.entries(collectorWiseSummary).map(([collector, details]) => ({
      'Collector': collector,
      'Total Collection': details.total,
      'Cash Collection': details.cashTotal,
      'Online Collection': details.onlineTotal,
      'Transaction Count': details.transactionCount,
      'Daily Average': details.dailyAverage,
      'Branch Count': Object.keys(details.branchWise).length,
      'Average Per Transaction': details.total / details.transactionCount
    }));
    
    generateExcelReport(data, 'Collector Performance Report', 'collector_performance_report');
  };

  const calculateEfficiencyScore = (details: CollectorSummary): number => {
    const avgTransactionValue = details.total / details.transactionCount;
    const branchCoverage = Object.keys(details.branchWise).length;
    // Normalize score to 0-100 range based on various factors
    const score = (
      (avgTransactionValue / 1000) * 40 + // Weight for average transaction value
      (details.transactionCount / 100) * 30 + // Weight for number of transactions
      (branchCoverage / 5) * 30 // Weight for branch coverage
    );
    return Math.min(Math.round(score), 100);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Collector-wise Performance Analysis</CardTitle>
        <Button variant="outline" onClick={handleExport} className="gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Collector</TableHead>
                  <TableHead>Total Collection</TableHead>
                  <TableHead>Collection Split</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>Daily Performance</TableHead>
                  <TableHead>Branch Performance</TableHead>
                  <TableHead>Efficiency Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(collectorWiseSummary)
                  .sort(([, a], [, b]) => b.total - a.total) // Sort by total collection
                  .map(([collector, details]) => (
                    <TableRow key={collector}>
                      <TableCell className="font-medium">{collector}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div>{formatCurrency(details.total)}</div>
                          <div className="text-sm text-gray-500">
                            ({Object.keys(details.branchWise).length} branches)
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            Cash: {formatCurrency(details.cashTotal)}
                            <span className="text-gray-500 ml-1">
                              ({((details.cashTotal / details.total) * 100).toFixed(1)}%)
                            </span>
                          </div>
                          <div className="text-sm">
                            Online: {formatCurrency(details.onlineTotal)}
                            <span className="text-gray-500 ml-1">
                              ({((details.onlineTotal / details.total) * 100).toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div>{details.transactionCount} total</div>
                          <div className="text-sm text-gray-500">
                            ({formatCurrency(details.total / details.transactionCount)} avg)
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div>{formatCurrency(details.dailyAverage)}</div>
                          <div className="text-sm text-gray-500">per day</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {Object.entries(details.branchWise)
                            .sort((a, b) => b[1].total - a[1].total) // Sort by branch total
                            .map(([branch, branchDetails]) => (
                              <div key={branch} className="text-sm">
                                {branch}: {formatCurrency(branchDetails.total)}
                                <span className="text-gray-500 ml-1">
                                  ({branchDetails.transactions} txns)
                                </span>
                              </div>
                            ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {calculateEfficiencyScore(details)}%
                          </div>
                          <div className="text-xs text-gray-500">
                            Based on transactions, value & coverage
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollectorAnalysis;