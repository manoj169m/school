// components/payment/ReportSummary.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp, CreditCard, Calendar, ArrowUpRight } from 'lucide-react';
import { PaymentReportData } from '@/types/monthly';

interface ReportSummaryProps {
  data: PaymentReportData;
}

export const ReportSummary: React.FC<ReportSummaryProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Collections Card */}
      <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Collections
          </CardTitle>
          <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-300">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">
            ₹{data.totalAmount.toLocaleString("en-IN")}
          </div>
          <div className="flex items-center text-sm text-blue-400 mt-2">
            <span>From {data.statistics.totalTransactions} transactions</span>
          </div>
        </CardContent>
      </Card>

      {/* Average Transaction Card */}
      <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Average Transaction
          </CardTitle>
          <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors duration-300">
            <CreditCard className="h-5 w-5 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-600">
            ₹
            {Math.round(data.statistics.averageTransactionValue).toLocaleString(
              "en-IN"
            )}
          </div>
          <div className="flex items-center text-sm text-purple-400 mt-2">
            <span>Per transaction value</span>
          </div>
        </CardContent>
      </Card>

      {/* Peak Collection Day Card */}
      <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-green-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Peak Collection Day
          </CardTitle>
          <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-300">
            <Calendar className="h-5 w-5 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          {data.statistics.peakCollections[0] ? (
            <>
              <div className="text-3xl font-bold text-green-600">
                ₹
                {data.statistics.peakCollections[0].amount.toLocaleString(
                  "en-IN"
                )}
              </div>
              <div className="flex items-center text-sm text-green-500 mt-2">
                <Calendar className="mr-1 h-4 w-4" />
                <span>
                  {new Date(
                    data.statistics.peakCollections[0].date
                  ).toLocaleDateString("en-IN")}
                </span>
              </div>
            </>
          ) : (
            <div className="text-sm text-green-600">
              No collections recorded
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Mode Distribution */}
      <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-amber-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Payment Modes</CardTitle>
          <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors duration-300">
            <CreditCard className="h-5 w-5 text-amber-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(data.paymentModes).map(([mode, details]) => (
              <div key={mode} className="flex justify-between items-center">
                <span className="text-sm text-amber-600">{mode}</span>
                <div className="flex items-center">
                  <div className="h-2 bg-amber-200 rounded-full w-16 mr-2">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{
                        width: `${(details.amount / data.totalAmount) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="font-medium text-amber-700">
                    {((details.amount / data.totalAmount) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Average */}
      <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-rose-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
          <div className="p-2 bg-rose-100 rounded-lg group-hover:bg-rose-200 transition-colors duration-300">
            <TrendingUp className="h-5 w-5 text-rose-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-rose-600">
            ₹
            {Math.round(
              data.totalAmount / data.dailyCollections.length
            ).toLocaleString("en-IN")}
          </div>
          <div className="flex items-center text-sm text-rose-400 mt-2">
            <span>Average daily collection</span>
          </div>
        </CardContent>
      </Card>

      {/* Collection Trend */}
      <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-cyan-50 to-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Collection Trend
          </CardTitle>
          <div className="p-2 bg-cyan-100 rounded-lg group-hover:bg-cyan-200 transition-colors duration-300">
            <ArrowUpRight className="h-5 w-5 text-cyan-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="text-3xl font-bold text-cyan-600">
                {data.statistics.totalTransactions}
              </span>
              <span className="text-sm text-cyan-400 ml-2">
                Total transactions
              </span>
            </div>
            <div className="text-sm text-cyan-400">
              {Object.keys(data.paymentModes).length} payment modes used
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information Section */}
      <div className="col-span-full">
        <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-indigo-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Quick Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-4 rounded-lg bg-white shadow-sm">
                <div className="text-sm font-medium text-indigo-400">
                  Most Used Payment Mode
                </div>
                <div className="text-2xl font-bold text-indigo-600">
                  {Object.entries(data.paymentModes).sort(
                    (a, b) => b[1].count - a[1].count
                  )[0]?.[0] || "N/A"}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white shadow-sm">
                <div className="text-sm font-medium text-indigo-400">
                  Unique Accounts
                </div>
                <div className="text-2xl font-bold text-indigo-600">
                  {Object.keys(data.accountBreakdown).length}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white shadow-sm">
                <div className="text-sm font-medium text-indigo-400">
                  Days with Collections
                </div>
                <div className="text-2xl font-bold text-indigo-600">
                  {data.dailyCollections.filter((day) => day.amount > 0).length}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white shadow-sm">
                <div className="text-sm font-medium text-indigo-400">
                  Average Daily Transactions
                </div>
                <div className="text-2xl font-bold text-indigo-600">
                  {Math.round(
                    data.statistics.totalTransactions /
                      data.dailyCollections.length
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportSummary;