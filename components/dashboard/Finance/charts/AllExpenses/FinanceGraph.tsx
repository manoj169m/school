"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useState } from "react" // Import useState for managing dialog state

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

// Data for the chart
const chartData = [
  { month: "January", income: 186, expenses: 80 },
  { month: "February", income: 305, expenses: 200 },
  { month: "March", income: 237, expenses: 120 },
  { month: "April", income: 73, expenses: 190 },
  { month: "May", income: 209, expenses: 130 },
  { month: "June", income: 214, expenses: 140 },
  { month: "July", income: 190, expenses: 110 },
  { month: "August", income: 245, expenses: 160 },
  { month: "September", income: 278, expenses: 180 },
  { month: "October", income: 312, expenses: 220 },
  { month: "November", income: 290, expenses: 200 },
  { month: "December", income: 330, expenses: 240 },
]

// Chart config
const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-1))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function FinanceGraph() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Handle opening and closing of the dialog
  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income / Expenses</CardTitle>
        <CardDescription>
          Showing total Income / Expenses for the entire year
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-income)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-income)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-expenses)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-expenses)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="expenses"
              type="natural"
              fill="url(#fillExpenses)"
              fillOpacity={0.4}
              stroke="var(--color-expenses)"
              stackId="a"
            />
            <Area
              dataKey="income"
              type="natural"
              fill="url(#fillIncome)"
              fillOpacity={0.4}
              stroke="var(--color-income)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className=" items-center gap-2 leading-none text-muted-foreground">
              January - December 2024
              {/* View Details link */}
              <div className=" pt-3">
              <a
                href="#"
                className="text-blue-600 cursor-pointer"
                onClick={toggleDialog}
              >
                View Details
              </a>
              </div>
            </div>
          </div>
        </div>
      </CardFooter>

      {/* Dialog for Detailed View */}
      <Dialog open={isDialogOpen} onOpenChange={toggleDialog}>
        <DialogContent className="max-w-6xl h-[85vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-background z-10 pb-6">
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Detailed Income and Expense Data
            </DialogTitle>
          </DialogHeader>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-200 to-gray-300">
                  <TableHead className="font-semibold text-base text-gray-800 p-4 text-left">Month</TableHead>
                  <TableHead className="font-semibold text-base text-gray-800 p-4 text-left">Income</TableHead>
                  <TableHead className="font-semibold text-base text-gray-800 p-4 text-left">Expenses</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chartData.map((row, index) => (
                  <TableRow key={index} className="hover:bg-gray-100 transition-all">
                    <TableCell className="text-base text-gray-700 p-4">{row.month}</TableCell>
                    <TableCell className="text-base text-gray-700 p-4">₹{row.income.toLocaleString()}</TableCell>
                    <TableCell className="text-base text-gray-700 p-4">₹{row.expenses.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default FinanceGraph
