"use client";

import { Card } from "@/components/ui/card";
import { useFinance } from "@/hooks/overalldashboards";
import { Wallet } from "lucide-react";


export function FinanceOverview() {
  const { receivable, payable } = useFinance();

  return (
    <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-green-500/10">
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          Finance Overview
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Receivable</span>
            <span className="font-bold text-green-600">
              ₹{receivable.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Payable</span>
            <span className="font-bold text-red-600">
              ₹{payable.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}