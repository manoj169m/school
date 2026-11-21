"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Standard, STANDARDS } from "@/lib/PeriodAllocationDashboard/constants/education";
import { getSubjectDistribution } from "@/lib/PeriodAllocationDashboard/data/subject-distribution";

export default function SubjectDistribution() {
  const [selectedStandard, setSelectedStandard] = useState<Standard>(
    STANDARDS[0]
  );
  const distributionData = getSubjectDistribution();
  const selectedData = distributionData.find(
    (d) => d.standard === selectedStandard
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Subject Distribution</h2>
          <Select
            value={selectedStandard}
            onValueChange={(value: Standard) => setSelectedStandard(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {STANDARDS.map((standard) => (
                <SelectItem key={standard} value={standard}>
                  {standard} Standard
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {selectedData?.distribution.map((item, index) => (
              <motion.div
                key={item.subject}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center"
              >
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.subject}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.periodsPerWeek} periods per week
                  </div>
                </div>
                <div className="w-[200px] h-4 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.periodsPerWeek / 10) * 100}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  />
                </div>
                <div className="w-16 text-right text-sm font-medium">
                  {((item.periodsPerWeek / 50) * 100).toFixed(1)}%
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </motion.div>
  );
}
