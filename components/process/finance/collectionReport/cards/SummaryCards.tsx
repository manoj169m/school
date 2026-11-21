import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, CreditCard, Building2, Users, ArrowUp } from "lucide-react";
import _ from 'lodash';

export interface Payment {
  id: number;
  receiptNumber: string;
  amount: number;
  paymentMode: string;
  collectedDate: string;
  collectedBy: string;
  reference?: string;
  bankName?: string;
  studentName?: string;
  className?: string;
  sectionName?: string;
  academicYear?: string;
  branchName?: string;
  accountName?: string;
}

export interface PaymentSummary {
  totalAmount: number;
  modeWiseTotal: { [key: string]: number };
  accountWiseTotal: { [key: string]: number };
  branchWiseTotal: { [key: string]: number };
}

interface SummaryCardsProps {
  summary: PaymentSummary;
}

export const PaymentDashboard: React.FC<{ payments: Payment[] }> = ({ payments }) => {
  const summary = useMemo(() => {
    const totalAmount = _.sumBy(payments, 'amount');

    const modeWiseTotal = _.chain(payments)
      .groupBy('paymentMode')
      .mapValues(group => _.sumBy(group, 'amount'))
      .value();

    const accountWiseTotal = _.chain(payments)
      .groupBy('accountName')
      .mapValues(group => _.sumBy(group, 'amount'))
      .value();

    const branchWiseTotal = _.chain(payments)
      .groupBy('branchName')
      .mapValues(group => _.sumBy(group, 'amount'))
      .value();

    return {
      totalAmount,
      modeWiseTotal,
      accountWiseTotal,
      branchWiseTotal
    };
  }, [payments]);

  return <SummaryCards summary={summary} />;
};

const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const formatAmount = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  const getPercentage = (amount: number, total: number) => ((amount / total) * 100).toFixed(1);

  return (
    <div className="space-y-10">
      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card className="relative overflow-hidden bg-gradient-to-tr from-custom-red-600 to-custom-pink-350 text-white shadow-lg hover:shadow-2xl transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Total Collection</CardTitle>
              <div className="p-2 bg-white/20 rounded-full">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <p className="text-4xl font-extrabold">{formatAmount(summary.totalAmount)}</p>
              <p className="text-sm mt-1">
                <span className="flex items-center gap-1">
                  <ArrowUp className="w-4 h-4" /> 12% from last month
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-800">Payment Modes</CardTitle>
              <div className="p-2 bg-purple-100 rounded-full">
                <CreditCard className="text-purple-600 w-5 h-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(summary.modeWiseTotal).map(([mode, amount]) => (
                <div key={mode}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-600">{mode}</span>
                    <span className="text-sm font-semibold text-gray-900">{formatAmount(amount)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className="bg-purple-500 h-full rounded-full"
                      style={{ width: `${getPercentage(amount, summary.totalAmount)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-800">Branch Collections</CardTitle>
              <div className="p-2 bg-green-100 rounded-full">
                <Building2 className="text-green-600 w-5 h-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(summary.branchWiseTotal)
                .sort((a, b) => b[1] - a[1])
                .map(([branch, amount]) => (
                  <div key={branch}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-600">{branch || 'Unspecified'}</span>
                      <span className="text-sm font-semibold text-gray-900">{formatAmount(amount)}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div
                        className="bg-green-500 h-full rounded-full"
                        style={{ width: `${getPercentage(amount, summary.totalAmount)}%` }}
                      ></div>
                    </div>
                  </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-800">Account Collections</CardTitle>
              <div className="p-2 bg-amber-100 rounded-full">
                <Users className="text-amber-600 w-5 h-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-48 overflow-y-auto custom-scrollbar">
              {Object.entries(summary.accountWiseTotal)
                .sort((a, b) => b[1] - a[1])
                .map(([account, amount]) => (
                  <div key={account}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-600 truncate max-w-[70%]" title={account}>
                        {account || 'Unspecified'}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">{formatAmount(amount)}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div
                        className="bg-amber-500 h-full rounded-full"
                        style={{ width: `${getPercentage(amount, summary.totalAmount)}%` }}
                      ></div>
                    </div>
                  </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default PaymentDashboard;
