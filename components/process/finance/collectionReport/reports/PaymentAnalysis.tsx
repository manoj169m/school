import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, 
  Wallet, 
  CreditCard, 
  Receipt,
  Search,
  ArrowUpDown,
  Calculator
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface PaymentTrend {
  total: number;
  cash: number;
  online: number;
  transactions: number;
}

interface PaymentAnalysisProps {
  paymentModeTrends: Record<string, PaymentTrend>;
}

export const PaymentAnalysis: React.FC<PaymentAnalysisProps> = ({ paymentModeTrends }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  const summaryStats = useMemo(() => {
    const stats = {
      totalCollection: 0,
      totalCash: 0,
      totalOnline: 0,
      totalTransactions: 0,
      avgTransactionValue: 0,
    };

    Object.values(paymentModeTrends).forEach(details => {
      stats.totalCollection += details.total;
      stats.totalCash += details.cash;
      stats.totalOnline += details.online;
      stats.totalTransactions += details.transactions;
    });

    stats.avgTransactionValue = stats.totalCollection / stats.totalTransactions;
    return stats;
  }, [paymentModeTrends]);

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredAndSortedData = useMemo(() => {
    return Object.entries(paymentModeTrends)
      .filter(([month]) => 
        month.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort(([monthA, a], [monthB, b]) => {
        if (!sortConfig.key) return 0;
        
        let aValue, bValue;
        
        switch(sortConfig.key) {
          case 'month':
            [aValue, bValue] = [monthA, monthB];
            break;
          case 'avgTransaction':
            [aValue, bValue] = [a.total / a.transactions, b.total / b.transactions];
            break;
          default:
            [aValue, bValue] = [a[sortConfig.key as keyof PaymentTrend], b[sortConfig.key as keyof PaymentTrend]];
        }

        return sortConfig.direction === 'asc'
          ? (aValue < bValue ? -1 : 1)
          : (aValue > bValue ? -1 : 1);
      });
  }, [paymentModeTrends, searchTerm, sortConfig]);

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                <p className="text-sm font-medium text-purple-600">Total Transactions</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {summaryStats.totalTransactions.toLocaleString()}
                </h3>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Receipt className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Avg. Transaction</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {formatCurrency(summaryStats.avgTransactionValue)}
                </h3>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Calculator className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="bg-white shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <CardTitle className="text-xl font-bold text-gray-900">Payment Mode Trends</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by month..."
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
                    onClick={() => handleSort('month')} 
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      Month
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
                    onClick={() => handleSort('cash')} 
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      Cash Collection
                      <ArrowUpDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </TableHead>
                  <TableHead 
                    onClick={() => handleSort('online')} 
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      Online Collection
                      <ArrowUpDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </TableHead>
                  <TableHead 
                    onClick={() => handleSort('transactions')} 
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      Transactions
                      <ArrowUpDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </TableHead>
                  <TableHead 
                    onClick={() => handleSort('avgTransaction')} 
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      Avg. Transaction Value
                      <ArrowUpDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.map(([month, details]) => {
                  const percentOnline = (details.online / details.total) * 100;
                  const percentCash = (details.cash / details.total) * 100;
                  
                  return (
                    <TableRow 
                      key={month}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <TableCell className="font-medium text-gray-900">{month}</TableCell>
                      <TableCell className="font-medium text-indigo-600">
                        {formatCurrency(details.total)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-emerald-600">
                            {formatCurrency(details.cash)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {percentCash.toFixed(1)}%
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-blue-600">
                            {formatCurrency(details.online)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {percentOnline.toFixed(1)}%
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {details.transactions.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-medium text-orange-600">
                        {formatCurrency(details.total / details.transactions)}
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

export default PaymentAnalysis;