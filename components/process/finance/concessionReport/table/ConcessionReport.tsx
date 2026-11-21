import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Search, PieChart, BarChart3, LineChart, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart as ReLineChart,
  Line,
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface Concession {
  id: number;
  amount: number;
  description: string | null;
  term: number;
  concessionCategory: {
    name: string;
  };
  studentFee: {
    enrollment: {
      student: {
        id: number;
        firstName: string;
        lastName: string;
      };
      class: {
        name: string;
      };
      branch: {
        name: string;
      };
      section: {
        name: string;
      };
    };
  };
}

interface ConcessionReportProps {
  concessions: Concession[];
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9FA0FF'];

const ConcessionReport: React.FC<ConcessionReportProps> = ({ concessions }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("all");

  // Define interfaces for data structures
  interface DataMap {
    [key: string]: number;
  }

  // Calculate analytics data
  const analytics = useMemo(() => {
    const classWiseData: DataMap = {};
    const termWiseData: DataMap = {};
    const categoryWiseData: DataMap = {};

    concessions.forEach((concession) => {
      // Class-wise analysis
      const className = concession.studentFee.enrollment.class.name;
      classWiseData[className] =
        (classWiseData[className] || 0) + concession.amount;

      // Term-wise analysis
      const term = `Term ${concession.term}`;
      termWiseData[term] = (termWiseData[term] || 0) + concession.amount;

      // Category-wise analysis
      const category = concession.concessionCategory.name;
      categoryWiseData[category] =
        (categoryWiseData[category] || 0) + concession.amount;
    });

    return {
      classWise: Object.entries(classWiseData).map(([name, value]) => ({
        name,
        value,
      })),
      termWise: Object.entries(termWiseData).map(([name, value]) => ({
        name,
        value,
      })),
      categoryWise: Object.entries(categoryWiseData).map(([name, value]) => ({
        name,
        value,
      })),
    };
  }, [concessions]);

  // Filter concessions based on search term and filter
  const filteredConcessions = concessions.filter((concession) => {
    const matchesSearch =
      concession.studentFee.enrollment.student.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      concession.studentFee.enrollment.student.lastName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      concession.concessionCategory.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      concession.studentFee.enrollment.class.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (concession.description?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      );

    const matchesFilter =
      filterTerm === "all" || concession.term.toString() === filterTerm;

    return matchesSearch && matchesFilter;
  });

  const totalAmount = concessions.reduce(
    (sum, concession) => sum + concession.amount,
    0
  );

  const handleDownload = () => {
    const csvContent = filteredConcessions
      .map(
        (c) =>
          `${c.studentFee.enrollment.student.firstName},${
            c.studentFee.enrollment.student.lastName
          },${c.amount},${c.term},${c.description || ""}`
      )
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "concessions.csv";
    a.click();
  };

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <Card className="shadow-lg border-0 rounded-xl bg-white">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Concession Report
              </CardTitle>
              <CardDescription className="mt-2 text-gray-600 font-medium">
                Total Concessions: {filteredConcessions.length} | Total Amount:{" "}
                <span className="text-green-600 font-semibold">
                  ₹{totalAmount.toLocaleString()}
                </span>
              </CardDescription>
            </div>
            <Button
              onClick={handleDownload}
              className="bg-white border border-red-600 text-red-600 font-bold hover:bg-red-600 hover:text-white transition-all duration-200 shadow-md"
            >
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by student name, class, category, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={filterTerm} onValueChange={setFilterTerm}>
                <SelectTrigger className="w-[180px] h-12 rounded-lg border-gray-200">
                  <SelectValue placeholder="Filter by Term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Terms</SelectItem>
                  {Array.from(new Set(concessions.map((c) => c.term))).map(
                    (term) => (
                      <SelectItem key={term} value={term.toString()}>
                        Term {term}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="table" className="w-full">
            <TabsList className="mb-6 p-1 bg-gray-100 rounded-lg">
              <TabsTrigger
                value="table"
                className="rounded-md px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Table View
              </TabsTrigger>
              <TabsTrigger
                value="analysis"
                className="rounded-md px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="table">
              <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700">
                        Student ID
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Student Name
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Class
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Branch
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Section
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Category
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Term
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Description
                      </TableHead>
                      <TableHead className="text-right font-semibold text-gray-700">
                        Amount
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredConcessions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-12">
                          <div className="flex flex-col items-center text-gray-500">
                            <Search className="h-8 w-8 mb-2" />
                            <p>No concessions found matching your criteria</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredConcessions.map((concession) => (
                        <TableRow
                          key={concession.id}
                          className="hover:bg-gray-50"
                        >
                          <TableCell className="font-medium text-gray-900">
                            {concession.studentFee.enrollment.student.id}
                          </TableCell>
                          <TableCell className="font-medium">
                            {concession.studentFee.enrollment.student.firstName}{" "}
                            {concession.studentFee.enrollment.student.lastName}
                          </TableCell>
                          <TableCell>
                            {concession.studentFee.enrollment.class.name}
                          </TableCell>
                          <TableCell>
                            {concession.studentFee.enrollment.branch.name}
                          </TableCell>
                          <TableCell>
                            {concession.studentFee.enrollment.section.name}
                          </TableCell>
                          <TableCell>
                            <span className="  text-sm  text-purple-700">
                              {concession.concessionCategory.name}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="  text-sm  text-blue-700">
                              Term {concession.term}
                            </span>
                          </TableCell>
                          <TableCell>{concession.description || "-"}</TableCell>
                          <TableCell className="text-right font-semibold text-green-600">
                            ₹{concession.amount.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="analysis">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-md rounded-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <BarChart3 className="h-5 w-5 text-purple-500" />
                      Class-wise Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.classWise}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) =>
                            `₹${Number(value).toLocaleString()}`
                          }
                          contentStyle={{
                            borderRadius: "8px",
                            border: "none",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Bar
                          dataKey="value"
                          fill="#4ECDC4"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="shadow-md rounded-xl  ">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <PieChart className="h-5 w-5 text-purple-500" />
                      Category-wise Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={analytics.categoryWise}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={(entry) => entry.name}
                        >
                          {analytics.categoryWise.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) =>
                            `₹${Number(value).toLocaleString()}`
                          }
                        />
                      </RePieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2 shadow-md rounded-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <LineChart className="h-5 w-5 text-purple-500" />
                      Term-wise Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReLineChart data={analytics.termWise}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) =>
                            `₹${Number(value).toLocaleString()}`
                          }
                          contentStyle={{
                            borderRadius: "8px",
                            border: "none",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#FF6B6B"
                          strokeWidth={2}
                          dot={{ fill: "#FF6B6B", strokeWidth: 2 }}
                          activeDot={{ r: 6, fill: "#FF6B6B" }}
                        />
                      </ReLineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConcessionReport;