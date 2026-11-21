import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, GraduationCap, WalletCards, UserCircle, ScrollText, PieChart, CalendarClock } from 'lucide-react';
import { Payment } from '@/types/payment';
import { useReportCalculations } from '@/hooks/useReportCalculations';
import { BranchAnalysis } from '../reports/BranchAnalysis';
import { ClassAnalysis } from '../reports/ClassAnalysis';
import { PaymentAnalysis } from '../reports/PaymentAnalysis';
import AccountAnalysis from '../reports/AccountAnalysis';
import CollectorAnalysis from '../reports/CollectorAnalysis';
import MatrixAnalysis from '../reports/MatrixAnalysis';
import TermAnalysis from '../reports/TermAnalysis';

interface DetailedReportsProps {
  payments: Payment[];
}

const DetailedReports: React.FC<DetailedReportsProps> = ({ payments }) => {
  const {
    branchWiseSummary,
    classWiseSummary,
    paymentModeTrends,
    accountWiseSummary,
    collectorWiseSummary,
    matrixSummary,
    termWiseSummary, // Add this to useReportCalculations
  } = useReportCalculations(payments);

  return (
    <Tabs defaultValue="branch" className="space-y-4">
      <TabsList className="grid grid-cols-2 lg:grid-cols-7 w-full">
        <TabsTrigger value="branch" className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Branch
        </TabsTrigger>
        <TabsTrigger value="class" className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          Class
        </TabsTrigger>
        <TabsTrigger value="payment" className="flex items-center gap-2">
          <WalletCards className="h-4 w-4" />
          Payments
        </TabsTrigger>
        <TabsTrigger value="account" className="flex items-center gap-2">
          <ScrollText className="h-4 w-4" />
          Accounts
        </TabsTrigger>
        <TabsTrigger value="collector" className="flex items-center gap-2">
          <UserCircle className="h-4 w-4" />
          Collectors
        </TabsTrigger>
        <TabsTrigger value="term" className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4" />
          Terms
        </TabsTrigger>
        <TabsTrigger value="comprehensive" className="flex items-center gap-2">
          <PieChart className="h-4 w-4" />
          Matrix
        </TabsTrigger>
      </TabsList>

      <TabsContent value="branch">
        <BranchAnalysis branchWiseSummary={branchWiseSummary} />
      </TabsContent>
      <TabsContent value="class">
        <ClassAnalysis classWiseSummary={classWiseSummary} />
      </TabsContent>
      <TabsContent value="payment">
        <PaymentAnalysis paymentModeTrends={paymentModeTrends} />
      </TabsContent>
      <TabsContent value="account">
        <AccountAnalysis accountWiseSummary={accountWiseSummary} />
      </TabsContent>
      <TabsContent value="collector">
        <CollectorAnalysis collectorWiseSummary={collectorWiseSummary} />
      </TabsContent>
      <TabsContent value="term">
        <TermAnalysis termWiseSummary={termWiseSummary} />
      </TabsContent>
      <TabsContent value="comprehensive">
        <MatrixAnalysis matrixSummary={matrixSummary} />
      </TabsContent>
    </Tabs>
  );
};

export default DetailedReports;