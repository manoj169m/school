// FeeDetailsPage.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { DataTable } from './table/datatable';
import { columns, getAccountWiseColumns, Payment } from './table/column';
import { Card, CardContent } from '@/components/ui/card';

const formatIndianCurrency = (amount: number): string => {
  const formatter = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  });
  return `₹${formatter.format(amount)}`;
};

interface FeeDetailsPageProps {
  data: Payment[];
}

type ViewMode = 'consolidated' | 'split';

const FeeDetailsPage: React.FC<FeeDetailsPageProps> = ({ data }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('consolidated');

  // Get unique account names from the data
  const accountNames: string[] = Array.from(
    new Set(
      data.flatMap(item => 
        item.accountWiseDetails.map(detail => detail.accountName)
      )
    )
  );

  // Choose columns based on view mode
  const activeColumns = viewMode === 'consolidated'
    ? columns
    : getAccountWiseColumns(accountNames);

  // Format data for export
  const getExportData = () => {
    if (viewMode === 'consolidated') {
      return data.map(item => ({
        'Admission No': item.admissionNo,
        'Name': item.name,
        'Roll Number': item.rollNumber,
        'Class': item.class,
        'Section': item.section,
        'Total Target Fee': item.totalTargetFee,
        'Total Concession': item.totalConcession,
        'Total Paid': item.totalPaid,
        'Total Pending': item.totalPending
      }));
    } else {
      return data.map(item => {
        const baseData = {
          'Admission No': item.admissionNo,
          'Name': item.name,
          'Roll Number': item.rollNumber,
          'Class': item.class,
          'Section': item.section,
        };

        const accountData = item.accountWiseDetails.reduce((acc, detail) => ({
          ...acc,
          [`${detail.accountName} Target`]: detail.targetFee,
          [`${detail.accountName} Concession`]: detail.concession,
          [`${detail.accountName} Paid`]: detail.paid,
          [`${detail.accountName} Pending`]: detail.pending,
        }), {});

        return { ...baseData, ...accountData };
      });
    }
  };

  const handleExport = () => {
    try {
      const exportData = getExportData();
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Payments");
      XLSX.writeFile(wb, `payments_${viewMode}_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  // Calculate summary statistics
  const summary = data.reduce((acc, item) => ({
    totalStudents: acc.totalStudents + 1,
    totalFees: acc.totalFees + item.totalTargetFee,
    totalPaid: acc.totalPaid + item.totalPaid,
    totalPending: acc.totalPending + item.totalPending,
    totalConcession: acc.totalConcession + item.totalConcession,
  }), {
    totalStudents: 0,
    totalFees: 0,
    totalPaid: 0,
    totalPending: 0,
    totalConcession: 0,
  });

  const summaryCards = [
    {
      title: 'Total Students',
      value: summary.totalStudents.toString(),
      prefix: '',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      icon: '👥'
    },
    {
      title: 'Total Fees',
      value: formatIndianCurrency(summary.totalFees),
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      icon: '💰'
    },
    {
      title: 'Total Paid',
      value: formatIndianCurrency(summary.totalPaid),
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      icon: '✅'
    },
    {
      title: 'Total Pending',
      value: formatIndianCurrency(summary.totalPending),
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      icon: '⚠️'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Fee Details</h2>
        <div className="flex gap-4">
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'consolidated' ? 'default' : 'outline'}
              onClick={() => setViewMode('consolidated')}
              className="font-medium"
            >
              Consolidated View
            </Button>
            <Button
              variant={viewMode === 'split' ? 'default' : 'outline'}
              onClick={() => setViewMode('split')}
              className="font-medium"
            >
              Split View
            </Button>
          </div>
          <Button
            onClick={handleExport}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <Download className="h-4 w-4" />
            Export to Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <Card key={index} className={`${card.bgColor} border-none shadow-md transition-transform duration-200 hover:scale-105`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{card.icon}</span>
                <span className={`text-3xl font-bold ${card.textColor}`}>{card.value}</span>
              </div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-md border bg-white shadow-sm p-6">
        <DataTable
          columns={activeColumns}
          data={data}
          accountNames={accountNames}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
};

export default FeeDetailsPage;