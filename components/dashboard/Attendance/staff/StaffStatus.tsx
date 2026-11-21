'use client';

import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader, 
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


// Defining types for the stats
interface StatItem {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
  department: string;
}

interface StatsProps {
  stats: StatItem[];
}

// StaffStats component to display individual stat cards
export const StaffStats: React.FC<StatsProps> = ({ stats }) => {
  const [selectedStat, setSelectedStat] = useState<StatItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (stat: StatItem) => {
    setSelectedStat(stat);
    setIsModalOpen(true);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="bg-white hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleCardClick(stat)}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {stat.icon}
              {stat.title}
            </CardTitle>
            <Badge variant={stat.trend === 'up' ? "default" : "destructive"}>
              {stat.trend === 'up' ? '↑' : '↓'}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.department}</p>
          </CardContent>
        </Card>
      ))}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedStat?.title} Details</DialogTitle>
            <DialogDescription>
              Detailed breakdown by department
            </DialogDescription>
          </DialogHeader>
          {selectedStat && (
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Teaching Staff</TableCell>
                    <TableCell>45</TableCell>
                    <TableCell>{selectedStat.trend === 'up' ? '+2%' : '-2%'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Administrative</TableCell>
                    <TableCell>15</TableCell>
                    <TableCell>{selectedStat.trend === 'up' ? '+1%' : '-1%'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Support Staff</TableCell>
                    <TableCell>20</TableCell>
                    <TableCell>{selectedStat.trend === 'up' ? '+3%' : '-3%'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};