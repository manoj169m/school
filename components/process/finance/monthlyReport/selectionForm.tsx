// components/payment/MonthlyPaymentReport.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReloadIcon } from "@radix-ui/react-icons";
import { PaymentReportData, AcademicYear, Branch } from "@/types/monthly";
import ReportSummary from "./card/ReportSummary";
import { PaymentCharts } from "./chart/PaymentCharts";
import { PaymentTables } from "./table/monthly-table";

const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const ALL_BRANCHES = "all";

export const MonthlyPaymentReport: React.FC = () => {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [reportData, setReportData] = useState<PaymentReportData | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [academicYearRes, branchesRes] = await Promise.all([
          fetch("/api/academicYears"),
          fetch("/api/branches"),
        ]);

        if (!academicYearRes.ok || !branchesRes.ok) {
          throw new Error("Failed to fetch initial data");
        }

        const academicYearData = await academicYearRes.json();
        const branchesData = await branchesRes.json();

        setAcademicYears(academicYearData);
        setBranches(branchesData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const handleSubmit = async () => {
    if (!selectedYear || !selectedBranch || !selectedMonth) {
      alert("Please select all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/payments/monthly-payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          academicYearId: selectedYear,
          branchId: selectedBranch,
          month: selectedMonth,
          includeAllBranches: selectedBranch === ALL_BRANCHES,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch report data");
      }

      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error("Error fetching report:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to generate report. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 ">
      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Academic Year
              </label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Academic Year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year.id} value={year.id.toString()}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Branch</label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_BRANCHES}>All Branches</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id.toString()}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Month</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-custom-pink-300 text-white font-bold hover:bg-custom-pink-350"
            >
              {loading ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Generating Report...
                </>
              ) : (
                "Generate Report"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {reportData && (
        <>
          <ReportSummary data={reportData} />
          <PaymentCharts data={reportData} />
          <PaymentTables data={reportData} />
        </>
      )}
    </div>
  );
};
