import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Building2, BookOpen, Users, Printer, Calculator, Calendar, Wallet, PieChart } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IFeeStructure } from '@/types/feecard';
import { PieChart as RechartsChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';


interface FeeStructureProps {
  feeData: IFeeStructure[] | null;
  isLoading: boolean;
}

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: React.ElementType;  // This is the correct type for a component passed as a prop
  bgColor: string;
}

const FeeStructure: React.FC<FeeStructureProps> = ({ feeData, isLoading }) => {
  // Improved memoized calculations
  const { groupedFeeData, summaryData } = useMemo(() => {
    if (!feeData || feeData.length === 0) {
      return { groupedFeeData: {}, summaryData: null };
    }

    const grouped = feeData.reduce((acc, fee) => {
      const branchKey = fee.branch.name;
      const classKey = fee.class.name;
      const sectionKey = fee.section.name;

      if (!acc[branchKey]) {
        acc[branchKey] = {};
      }
      if (!acc[branchKey][classKey]) {
        acc[branchKey][classKey] = {};
      }
      if (!acc[branchKey][classKey][sectionKey]) {
        acc[branchKey][classKey][sectionKey] = [];
      }

      acc[branchKey][classKey][sectionKey].push(fee);
      return acc;
    }, {} as Record<string, Record<string, Record<string, IFeeStructure[]>>>);

    // Calculate accurate summaries
    const summary = {
      totalAmount: 0,
      byAccount: {} as Record<string, number>,
      byClass: {} as Record<string, number>,
      byTerm: {} as Record<string, number>,
      byBranch: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
    };

    feeData.forEach(fee => {
      const amount = Number(fee.amount) || 0; // Ensure amount is a number
      summary.totalAmount += amount;
      
      // Accumulate totals with null checks
      const accountName = fee.account?.accountName || 'Uncategorized';
      const className = fee.class?.name || 'Uncategorized';
      const termKey = `Term ${fee.term || 0}`;
      const branchName = fee.branch?.name || 'Uncategorized';
      const categoryName = fee.feeCategory?.category || 'Uncategorized';

      summary.byAccount[accountName] = (summary.byAccount[accountName] || 0) + amount;
      summary.byClass[className] = (summary.byClass[className] || 0) + amount;
      summary.byTerm[termKey] = (summary.byTerm[termKey] || 0) + amount;
      summary.byBranch[branchName] = (summary.byBranch[branchName] || 0) + amount;
      summary.byCategory[categoryName] = (summary.byCategory[categoryName] || 0) + amount;
    });

    return { groupedFeeData: grouped, summaryData: summary };
  }, [feeData]);


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      console.log(error);
      return 'Invalid Date';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!feeData || feeData.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-md">Please select different criteria to view fee details</p>
      </div>
    );
  }

  const SummaryCard = ({ title, amount, icon: Icon, bgColor }: SummaryCardProps) => (
    <Card className={`${bgColor} transition-all duration-200 hover:shadow-lg`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(amount)}</p>
          </div>
          <Icon className="h-8 w-8 text-gray-600 opacity-75" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="flex justify-between items-center print:hidden">
        <h2 className="text-2xl font-bold text-gray-900">Fee Structure Analysis</h2>
        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Printer className="h-4 w-4" />
          <span>Print Report</span>
        </button>
      </div>

      {summaryData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Fee Collection"
            amount={summaryData.totalAmount}
            icon={Calculator}
            bgColor="bg-blue-50"
          />
          <SummaryCard
            title="Average Per Term"
            amount={summaryData.totalAmount / Object.keys(summaryData.byTerm).length}
            icon={Calendar}
            bgColor="bg-green-50"
          />
          <SummaryCard
            title="Average Per Class"
            amount={summaryData.totalAmount / Object.keys(summaryData.byClass).length}
            icon={BookOpen}
            bgColor="bg-purple-50"
          />
          <SummaryCard
            title="Average Per Branch"
            amount={summaryData.totalAmount / Object.keys(summaryData.byBranch).length}
            icon={Building2}
            bgColor="bg-orange-50"
          />
        </div>
      )}

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 print:hidden">
          <TabsTrigger value="details">Detailed View</TabsTrigger>
          <TabsTrigger value="accounts">Account Summary</TabsTrigger>
          <TabsTrigger value="terms">Term Analysis</TabsTrigger>
          <TabsTrigger value="categories">Category Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card className="w-full bg-white shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <span>Fee Structure Details</span>
                </div>
                <div className="flex space-x-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {Object.keys(groupedFeeData).length} Branches
                  </Badge>
                  {summaryData && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {formatCurrency(summaryData.totalAmount)}
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ScrollArea className="h-[600px] pr-4">
                <Accordion type="single" collapsible className="space-y-4">
                  {Object.entries(groupedFeeData).map(([branchName, classes]) => (
                    <AccordionItem
                      key={branchName}
                      value={branchName}
                      className="border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 px-4 bg-white"
                    >
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-3">
                            <Building2 className="h-5 w-5 text-blue-600" />
                            <span className="font-semibold text-gray-800">{branchName}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                              {Object.keys(classes).length} Classes
                            </Badge>
                            {summaryData && (
                              <Badge variant="outline" className="border-green-200 text-green-700">
                                {formatCurrency(summaryData.byBranch[branchName])}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <div className="space-y-4 pl-4">
                          {Object.entries(classes).map(([className, sections]) => (
                            <Accordion
                              key={className}
                              type="single"
                              collapsible
                              className="border-l-2 border-blue-100 pl-4"
                            >
                              <AccordionItem value={className} className="border-none">
                                <AccordionTrigger className="hover:no-underline py-3">
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center space-x-3">
                                      <BookOpen className="h-4 w-4 text-indigo-600" />
                                      <span className="font-medium text-gray-700">{className}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <Badge variant="outline" className="border-indigo-200 text-indigo-700">
                                        {Object.keys(sections).length} Sections
                                      </Badge>
                                      {summaryData && (
                                        <Badge variant="outline" className="border-green-200 text-green-700">
                                          {formatCurrency(summaryData.byClass[className])}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  {Object.entries(sections).map(([sectionName, fees]) => (
                                    <div
                                      key={sectionName}
                                      className="mt-4 border-l-2 border-indigo-100 pl-4"
                                    >
                                      <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center">
                                          <Users className="h-4 w-4 text-indigo-600 mr-2" />
                                          <span className="font-medium text-gray-700">
                                            Section {sectionName}
                                          </span>
                                        </div>
                                        <Badge className="bg-indigo-100 text-indigo-700">
                                          {fees.length} Fees
                                        </Badge>
                                      </div>
                                      <div className="space-y-3">
                                        {fees.map((fee, index) => (
                                          <div
                                            key={index}
                                            className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 hover:from-gray-100 hover:to-blue-100 transition-all duration-200 shadow-sm hover:shadow"
                                          >
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                              <div className="space-y-1">
                                                <p className="text-sm text-gray-500">Fee Category</p>
                                                <p className="font-medium text-gray-800">{fee.feeCategory.category}</p>
                                              </div>
                                              <div className="space-y-1">
                                                <p className="text-sm text-gray-500">Amount</p>
                                                <p className="font-medium text-green-600">
                                                  {formatCurrency(fee.amount)}
                                                </p>
                                              </div>
                                              <div className="space-y-1">
                                                <p className="text-sm text-gray-500">Due Date</p>
                                                <p className="font-medium text-gray-800">{formatDate(fee.dueDate)}</p>
                                              </div>
                                              <div className="space-y-1">
                                                <p className="text-sm text-gray-500">Term</p>
                                                <p className="font-medium text-gray-800">Term {fee.term}</p>
                                              </div>
                                              <div className="space-y-1">
                                                <p className="text-sm text-gray-500">Account</p>
                                                <p className="font-medium text-gray-800">{fee.account.accountName}</p>
                                              </div>
                                              <div className="space-y-1">
                                                <p className="text-sm text-gray-500">Type</p>
                                                <Badge variant="outline" className="border-blue-200 text-blue-700">
                                                  {fee.gender}
                                                </Badge>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wallet className="h-5 w-5 text-blue-600" />
                <span>Account-wise Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {summaryData && Object.entries(summaryData.byAccount).map(([account, amount]) => (
                    <div
                      key={account}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg"
                    >
                      <span className="font-medium text-gray-700">{account}</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {formatCurrency(amount)}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsChart>
                      <Pie
                        data={summaryData ? Object.entries(summaryData.byAccount).map(([name, value]) => ({
                          name,
                          value
                        })) : []}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {summaryData && Object.entries(summaryData.byAccount).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                    </RechartsChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terms">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Term-wise Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {summaryData && Object.entries(summaryData.byTerm)
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([term, amount]) => (
                    <div
                      key={term}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-lg"
                    >
                      <span className="font-medium text-gray-700">{term}</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {formatCurrency(amount)}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsChart>
                      <Pie
                        data={summaryData ? Object.entries(summaryData.byTerm)
                          .sort((a, b) => a[0].localeCompare(b[0]))
                          .map(([name, value]) => ({
                            name,
                            value
                          })) : []}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {summaryData && Object.entries(summaryData.byTerm).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 60 + 120}, 70%, 60%)`} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                    </RechartsChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-blue-600" />
                <span>Category Breakdown</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {summaryData && Object.entries(summaryData.byCategory)
                    .sort((a, b) => b[1] - a[1])
                    .map(([category, amount]) => (
                    <div
                      key={category}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg"
                    >
                      <span className="font-medium text-gray-700">{category}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                          {formatCurrency(amount)}
                        </Badge>
                        <Badge variant="outline" className="border-purple-200 text-purple-700">
                          {((amount / summaryData.totalAmount) * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsChart>
                      <Pie
                        data={summaryData ? Object.entries(summaryData.byCategory)
                          .sort((a, b) => b[1] - a[1])
                          .map(([name, value]) => ({
                            name,
                            value
                          })) : []}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {summaryData && Object.entries(summaryData.byCategory).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 30 + 240}, 70%, 60%)`} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                    </RechartsChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <style jsx global>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .print\\:break-after-page {
            break-after: page;
          }
          .print\\:m-0 {
            margin: 0 !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FeeStructure;