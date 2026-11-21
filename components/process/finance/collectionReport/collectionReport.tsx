'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, FileSpreadsheet, Filter, RefreshCw } from 'lucide-react';
import { MultiSelectCombobox } from '@/components/ui/combobox';
import { FormattedOption, Payment } from '@/types/payment';
import { exportToExcel } from '@/utils/payment';

import { PaymentTable } from './table/PaymentTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import DetailedReports from './table/DetailedReports ';
import PaymentDashboard from './cards/SummaryCards';

const PaymentReport = () => {
  const [academicYears, setAcademicYears] = useState<FormattedOption[]>([]);
  const [accounts, setAccounts] = useState<FormattedOption[]>([]);
  const [branches, setBranches] = useState<FormattedOption[]>([]);
  const [selectedAcademicYears, setSelectedAcademicYears] = useState<string[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedTerms, setSelectedTerms] = useState<string[]>(['1', '2', '3']);
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [paymentMode, setPaymentMode] = useState<string[]>(['Cash', 'Online']);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);

  const handleFromDateSelect = (date: Date | undefined) => {
    if (date) {
      setFromDate(date);
      setFromDateOpen(false);
    }
  };

  const handleToDateSelect = (date: Date | undefined) => {
    if (date) {
      setToDate(date);
      setToDateOpen(false);
    }
  };

  const terms: FormattedOption[] = [
    { value: '1', label: 'Term - 1' },
    { value: '2', label: 'Term - 2' },
    { value: '3', label: 'Term - 3' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [academicYearRes, accountsRes, branchesRes] = await Promise.all([
          fetch('/api/academicYears'),
          fetch('/api/accounts'),
          fetch('/api/branches')
        ]);

        const academicYearData: { id: number; label: string }[] = await academicYearRes.json();
        const accountsData: { id: number; accountName: string }[] = await accountsRes.json();
        const branchesData: { id: number; name: string }[] = await branchesRes.json();

        const formattedAcademicYears: FormattedOption[] = academicYearData.map((year) => ({
          value: year.id.toString(),
          label: year.label
        }));

        const formattedAccounts: FormattedOption[] = accountsData.map((account) => ({
          value: account.id.toString(),
          label: account.accountName
        }));

        const formattedBranches: FormattedOption[] = branchesData.map((branch) => ({
          value: branch.id.toString(),
          label: branch.name
        }));

        setAcademicYears(formattedAcademicYears);
        setAccounts(formattedAccounts);
        setBranches(formattedBranches);

        // Set all options selected by default
        setSelectedAcademicYears(formattedAcademicYears.map((y: FormattedOption) => y.value));
        setSelectedAccounts(formattedAccounts.map((a: FormattedOption) => a.value));
        setSelectedBranches(formattedBranches.map((b: FormattedOption) => b.value));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Format dates in YYYY-MM-DD HH:mm:ss format without timezone conversion
      const formatDateForDB = (date: Date) => {
        // Get date components from the local date
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        // For fromDate, set time to start of day
        if (date === fromDate) {
          return `${year}-${month}-${day} 00:00:00`;
        }
        // For toDate, set time to end of day
        return `${year}-${month}-${day} 23:59:59`;
      };

      const response = await fetch('/api/payments/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          academicYears: selectedAcademicYears,
          accounts: selectedAccounts,
          branches: selectedBranches,
          terms: selectedTerms,
          fromDate: formatDateForDB(fromDate),
          toDate: formatDateForDB(toDate),
          paymentModes: paymentMode
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }

      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Academic Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Academic Year</label>
                  <MultiSelectCombobox
                    options={academicYears}
                    value={selectedAcademicYears}
                    onChange={setSelectedAcademicYears}
                    placeholder="Select Academic Years"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Terms</label>
                  <MultiSelectCombobox
                    options={terms}
                    value={selectedTerms}
                    onChange={setSelectedTerms}
                    placeholder="Select Terms"
                  />
                </div>
              </div>
            </div>

            {/* Organization Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Branches</label>
                  <MultiSelectCombobox
                    options={branches}
                    value={selectedBranches}
                    onChange={setSelectedBranches}
                    placeholder="Select Branches"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Accounts</label>
                  <MultiSelectCombobox
                    options={accounts}
                    value={selectedAccounts}
                    onChange={setSelectedAccounts}
                    placeholder="Select Accounts"
                  />
                </div>
              </div>
            </div>

            {/* Payment Details Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Payment Mode</label>
                  <MultiSelectCombobox
                    options={[
                      { value: 'Cash', label: 'Cash' },
                      { value: 'Online', label: 'Online' }
                    ]}
                    value={paymentMode}
                    onChange={setPaymentMode}
                    placeholder="Select Payment Modes"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Date Range</label>
                  <div className="grid grid-cols-2 gap-3">
                    <Popover open={fromDateOpen} onOpenChange={setFromDateOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(fromDate, 'dd MMM yyyy')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={fromDate}
                          onSelect={handleFromDateSelect}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Popover open={toDateOpen} onOpenChange={setToDateOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(toDate, 'dd MMM yyyy')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={toDate}
                          onSelect={handleToDateSelect}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="min-w-[140px]"
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Generate Report'
              )}
            </Button>
            {payments.length > 0 && (
              <Button
                onClick={() => exportToExcel(payments)}
                variant="outline"
                className="gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Export to Excel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {payments.length > 0 ? (
        <div className="space-y-6">
          <PaymentDashboard payments={payments} />
          <PaymentTable payments={payments}  />
          <DetailedReports payments={payments} />

        </div>
      ) : (
        <Alert>
          <AlertDescription>
            Use the filters above to generate a payment report. The report will show payment collections based on your selected criteria.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default PaymentReport;