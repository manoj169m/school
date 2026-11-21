import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HostelDialog } from "../dialog/hostel";
import { TransportDialog } from "../dialog/transport";
import {
  History,
  SquareActivity,
  Wallet,
  WalletMinimal,
  User,
  Phone,
  BookOpen,
  Users,
  GraduationCap,
  UsersRound,
  Building2,
  Bus,
  Contact,
  ChevronRight,
  Calendar,
  Clock,
  AlertCircle,
  BookUser,
  NotebookTabs,
} from "lucide-react";

interface StudentDetails {
  name: string;
  fatherName: string;
  branch: string;
  contactNo: string;
  class: string;
  section: string;
  phoneNo:string;
  admissionNo: string;
  rollNo: string;
}

interface Fee {
  accountId: number;
  amount: number;
}

interface FeeWithAccount extends Fee {
  dueDate: string;
  account: {
    accountName: string;
  };
}

interface FeeData {
  regularFees: FeeWithAccount[];
  transportFee: FeeWithAccount | null;
  hostelFee: FeeWithAccount | null;
  individualFees: Fee[];
  concessions: Fee[];
  payments: Fee[];
}

interface StudentProfileCardProps {
  studentDetails: StudentDetails;
  feeData: FeeData;
}

export function StudentProfileCard({ studentDetails, feeData }: StudentProfileCardProps) {
  const [isHostelDialogOpen, setIsHostelDialogOpen] = useState(false);
  const [isTransportDialogOpen, setIsTransportDialogOpen] = useState(false);

  const calculateTotalAmount = (): number => {
    const regularFeesTotal = feeData.regularFees?.reduce((sum, fee) => sum + (fee.amount || 0), 0) || 0;
    const transportFeeTotal = feeData.transportFee?.amount || 0;
    const hostelFeeTotal = feeData.hostelFee?.amount || 0;
    const individualFeesTotal = feeData.individualFees?.reduce((sum, fee) => sum + (fee.amount || 0), 0) || 0;
    return regularFeesTotal + transportFeeTotal + hostelFeeTotal + individualFeesTotal;
  };

  const calculateTotalConcession = (): number => {
    return feeData.concessions?.reduce((sum, concession) => sum + (concession.amount || 0), 0) || 0;
  };

  const calculateTotalPaid = (): number => {
    return feeData.payments?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;
  };

  const calculateDueAmount = (): number => {
    return calculateTotalAmount() - calculateTotalConcession() - calculateTotalPaid();
  };

  const getNextDueDate = (): string => {
    const allDueDates = feeData.regularFees
      .map(fee => new Date(fee.dueDate))
      .filter(date => date > new Date())
      .sort((a, b) => a.getTime() - b.getTime());
    
    return allDueDates[0]?.toLocaleDateString() || 'No upcoming due dates';
  };

  const studentInfoItems = [
    { icon: <User className="w-5 h-5" />, label: "Name", value: studentDetails.name },
    { icon: <Users className="w-5 h-5" />, label: "Father's Name", value: studentDetails.fatherName },
    { icon: <BookOpen className="w-5 h-5" />, label: "Branch", value: studentDetails.branch },
    { icon: <Phone className="w-5 h-5" />, label: "Contact", value: `${studentDetails.contactNo}, ${studentDetails.phoneNo}` },
    { icon: <GraduationCap className="w-5 h-5" />, label: "Class", value: studentDetails.class },
    { icon: <UsersRound className="w-5 h-5" />, label: "Section", value: studentDetails.section },
    { icon: <BookUser className="w-5 h-5" />, label: "Admisson No", value: studentDetails.admissionNo },
    { icon: <NotebookTabs className="w-5 h-5" />, label: "Roll No", value: studentDetails.rollNo }
  ];

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl">
      {/* Header with Quick Actions */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05]" />
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-lg rounded-xl">
              <Contact className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{studentDetails.name}</h2>
              <p className="text-blue-100">{studentDetails.class} {studentDetails.section}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setIsHostelDialogOpen(true)}
              className="group bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white px-4 py-2 rounded-xl"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Hostel
            </Button>
            <Button
              onClick={() => setIsTransportDialogOpen(true)}
              className="group bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white px-4 py-2 rounded-xl"
            >
              <Bus className="w-4 h-4 mr-2" />
              Transport
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: <Calendar className="w-5 h-5" />,
            label: "Next Due Date",
            value: getNextDueDate(),
            color: "bg-blue-500"
          },
          {
            icon: <Clock className="w-5 h-5" />,
            label: "Payment Status",
            value: calculateDueAmount() > 0 ? "Pending" : "Paid",
            color: calculateDueAmount() > 0 ? "bg-yellow-500" : "bg-green-500"
          },
          {
            icon: <AlertCircle className="w-5 h-5" />,
            label: "Due Amount",
            value: `₹${calculateDueAmount().toLocaleString('en-IN')}`,
            color: "bg-red-500"
          },
          {
            icon: <Wallet className="w-5 h-5" />,
            label: "Total Paid",
            value: `₹${calculateTotalPaid().toLocaleString('en-IN')}`,
            color: "bg-green-500"
          }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${stat.color} text-white rounded-lg`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-lg font-semibold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Student Info Card */}
        <Card className="lg:col-span-2 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-xl font-semibold">Student Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studentInfoItems.map((item, index) => (
                <div
                  key={index}
                  className="group bg-gray-50 hover:bg-gray-100 p-4 rounded-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{item.label}</p>
                      <p className="text-lg font-medium">{item.value}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 ml-auto text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary Card */}
        <Card className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-xl font-semibold">Financial Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {[
                {
                  icon: <Wallet className="w-5 h-5" />,
                  label: "Total Amount",
                  amount: calculateTotalAmount(),
                  color: "from-blue-500 to-blue-600"
                },
                {
                  icon: <SquareActivity className="w-5 h-5" />,
                  label: "Total Concession",
                  amount: calculateTotalConcession(),
                  color: "from-green-500 to-green-600"
                },
                {
                  icon: <WalletMinimal className="w-5 h-5" />,
                  label: "Total Paid",
                  amount: calculateTotalPaid(),
                  color: "from-indigo-500 to-indigo-600"
                },
                {
                  icon: <History className="w-5 h-5" />,
                  label: "Due Amount",
                  amount: calculateDueAmount(),
                  color: "from-red-500 to-red-600"
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden bg-gray-50 hover:bg-gray-100 p-4 rounded-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 bg-gradient-to-r ${item.color} text-white rounded-lg`}>
                        {item.icon}
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <span className="text-lg font-semibold">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${item.color} transition-all duration-300 group-hover:w-full`} style={{ width: '30%' }} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <HostelDialog
        isOpen={isHostelDialogOpen}
        onClose={() => setIsHostelDialogOpen(false)}
      />
      <TransportDialog
        isOpen={isTransportDialogOpen}
        onClose={() => setIsTransportDialogOpen(false)}
      />
    </div>
  );
}