import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { PaymentReportData } from "@/types/monthly";
//import { Coins, Users, CreditCard } from "lucide-react";

interface PaymentTablesProps {
  data: PaymentReportData;
}

export const PaymentTables: React.FC<PaymentTablesProps> = ({ data }) => {
  // Calculate daily collections total
  const dailyTotal = data.dailyCollections
    .filter((day) => day.transactions > 0)
    .reduce((acc, day) => acc + day.amount, 0);

  // Calculate total transactions
  const totalTransactions = data.dailyCollections
    .filter((day) => day.transactions > 0)
    .reduce((acc, day) => acc + day.transactions, 0);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <Coins className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Total Collections
                </p>
                <h3 className="text-2xl font-bold">
                  ₹{data.totalAmount.toLocaleString("en-IN")}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600">
                  Total Students
                </p>
                <h3 className="text-2xl font-bold">{data.payments.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500 rounded-lg">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-600">
                  Payment Modes
                </p>
                <h3 className="text-2xl font-bold">
                  {Object.keys(data.paymentModes).length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Daily Collections Table */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardTitle className="text-blue-800">
            Daily Collections Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto mt-2">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="text-right font-semibold">
                    Amount
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Transactions
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Average Per Transaction
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.dailyCollections
                  .filter((day) => day.transactions > 0)
                  .map((day) => (
                    <TableRow key={day.date} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {new Date(day.date).toLocaleDateString("en-IN", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{day.amount.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell className="text-right">
                        {day.transactions}
                      </TableCell>
                      <TableCell className="text-right">
                        ₹
                        {(day.amount / day.transactions).toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 2,
                          }
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <TableFooter className="bg-blue-50">
                <TableRow>
                  <TableCell className="font-bold">Total</TableCell>
                  <TableCell className="text-right font-bold">
                    ₹{dailyTotal.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {totalTransactions}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    ₹
                    {(dailyTotal / totalTransactions).toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Transactions Table */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
          <CardTitle className="text-green-800">Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto mt-2">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Receipt No.</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Student Name</TableHead>
                  <TableHead className="text-right font-semibold">
                    Amount
                  </TableHead>
                  <TableHead className="font-semibold">Payment Mode</TableHead>
                  <TableHead className="font-semibold">Account</TableHead>
                  <TableHead className="font-semibold">Collected By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.payments.map((payment) => (
                  <TableRow key={payment.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {payment.receiptNumber}
                    </TableCell>
                    <TableCell>
                      {new Date(payment.collectedDate).toLocaleDateString(
                        "en-IN"
                      )}
                    </TableCell>
                    <TableCell>{payment.studentName}</TableCell>
                    <TableCell className="text-right">
                      ₹{payment.amount.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>{payment.paymentMode}</TableCell>
                    <TableCell>{payment.accountName}</TableCell>
                    <TableCell>{payment.collectedBy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className="bg-green-50">
                <TableRow>
                  <TableCell colSpan={3} className="font-bold">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    ₹
                    {data.payments
                      .reduce((sum, payment) => sum + payment.amount, 0)
                      .toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell colSpan={3}></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Mode Summary Table */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
          <CardTitle className="text-purple-800">
            Payment Mode Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto mt-2">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Payment Mode</TableHead>
                  <TableHead className="text-right font-semibold">
                    Total Amount
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Transactions
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Average Amount
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Share (%)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(data.paymentModes).map(([mode, details]) => (
                  <TableRow key={mode} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{mode}</TableCell>
                    <TableCell className="text-right">
                      ₹{details.amount.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell className="text-right">
                      {details.count}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹
                      {(details.amount / details.count).toLocaleString(
                        "en-IN",
                        {
                          maximumFractionDigits: 2,
                        }
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {((details.amount / data.totalAmount) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className="bg-purple-50">
                <TableRow>
                  <TableCell className="font-bold">Total</TableCell>
                  <TableCell className="text-right font-bold">
                    ₹{data.totalAmount.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {Object.values(data.paymentModes).reduce(
                      (sum, mode) => sum + mode.count,
                      0
                    )}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    ₹
                    {(
                      data.totalAmount /
                      Object.values(data.paymentModes).reduce(
                        (sum, mode) => sum + mode.count,
                        0
                      )
                    ).toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right font-bold">100%</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
