"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Day, DAYS } from "@/lib/PeriodAllocationDashboard/constants/education";
import { getTeacherFreePeriodsByDay } from "@/lib/PeriodAllocationDashboard/data/free-periods";

export default function FreePeriodSummary() {
  const [selectedDay, setSelectedDay] = useState<Day>("Monday");
  const freePeriods = getTeacherFreePeriodsByDay(selectedDay);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 ">
        <h2 className="text-3xl font-bold mb-4">Free Period Summary</h2>
        <Tabs
          value={selectedDay}
          onValueChange={(value) => setSelectedDay(value as Day)}
        >
          <TabsList className="mb-4">
            {DAYS.map((day) => (
              <TabsTrigger key={day} value={day}>
                {day}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedDay}>
            <ScrollArea className="h-[400px]">
              <div className="grid gap-4">
                {freePeriods.map((teacher) => (
                  <motion.div
                    key={teacher.teacherId}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-card rounded-lg shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-xl">
                        {teacher.teacherName}
                      </h3>
                      
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {teacher.periods.map((period) => (
                        <Badge
                          key={period}
                          variant="outline"
                          className="bg-primary/5 text-base"
                          
                        >
                          {period}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </Card>
    </motion.div>
  );
}
