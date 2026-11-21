"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { BarChart, ResponsiveContainer, Bar, XAxis, YAxis, Tooltip } from "recharts";

interface FinanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FinanceDialog({ open, onOpenChange }: FinanceDialogProps) {
  const monthlyFinance = [
    { month: "Apr", receivable: 250000, payable: 180000, concession: 20000 },
    { month: "May", receivable: 220000, payable: 170000, concession: 15000 },
    { month: "Jun", receivable: 280000, payable: 190000, concession: 25000 },
    { month: "Jul", receivable: 240000, payable: 175000, concession: 18000 },
    { month: "Aug", receivable: 260000, payable: 185000, concession: 22000 },
    { month: "Sep", receivable: 230000, payable: 172000, concession: 16000 },
    { month: "Oct", receivable: 270000, payable: 188000, concession: 23000 },
    { month: "Nov", receivable: 245000, payable: 178000, concession: 19000 },
    { month: "Dec", receivable: 255000, payable: 182000, concession: 21000 },
    { month: "Jan", receivable: 235000, payable: 174000, concession: 17000 },
    { month: "Feb", receivable: 265000, payable: 186000, concession: 24000 },
    { month: "Mar", receivable: 250000, payable: 180000, concession: 20000 },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">Monthly Finance Overview</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Monthly Breakdown</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyFinance}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="receivable" fill="#22c55e" name="Receivable" />
                  <Bar dataKey="payable" fill="#ef4444" name="Payable" />
                  <Bar dataKey="concession" fill="#3b82f6" name="Concession" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {monthlyFinance.map((item) => (
              <Card key={item.month} className="p-4 hover:shadow-lg transition-all duration-300">
                <h4 className="font-semibold mb-2">{item.month}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Receivable:</span>
                    <span className="font-semibold text-green-600">
                      ₹{item.receivable.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Payable:</span>
                    <span className="font-semibold text-red-600">
                      ₹{item.payable.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Concession:</span>
                    <span className="font-semibold text-blue-600">
                      ₹{item.concession.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}