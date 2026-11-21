"use client"
import React, { useState } from "react"
import { TrendingUp, Calendar as CalendarIcon } from "lucide-react"
import { Pie, PieChart } from "recharts"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const chartData = [   
  { browser: "Expenses", visitors: 275, fill: "var(--color-Expenses)" },   
  { browser: "Income", visitors: 200, fill: "var(--color-Income)" },
]  

const chartConfig = {   
  visitors: {     
    label: "Visitors",   
  },   
  Expenses: {     
    label: "Expenses",     
    color: "hsl(var(--chart-1))",   
  },   
  Income: {     
    label: "Income",     
    color: "hsl(var(--chart-2))",   
  },
} satisfies ChartConfig  

const mockData = [
  {
    class: 'Class 10',
    section: 'A',
    totalStudents: 45,
    totalAmount: 450000,
    concession: 25000,
    dueAmount: 75000,
  },
  {
    class: 'Class 10',
    section: 'B',
    totalStudents: 42,
    totalAmount: 420000,
    concession: 20000,
    dueAmount: 65000,
  },
  {
    class: 'Class 11',
    section: 'A',
    totalStudents: 38,
    totalAmount: 480000,
    concession: 30000,
    dueAmount: 82000,
  },
  {
    class: 'Class 11',
    section: 'B',
    totalStudents: 40,
    totalAmount: 500000,
    concession: 28000,
    dueAmount: 79000,
  },
]

export function FinanceBar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [dialogOpen, setDialogOpen] = useState(false)
  
  const handleViewDetailsClick = () => {
    setDialogOpen(true)  // Open the dialog to show the table
  }

  return (     
    <Card className="flex flex-col">       
      <CardHeader className="items-start pb-0">         
        <CardTitle className="text-sm">Daily Income/Expenses</CardTitle>         
        <CardDescription className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </CardDescription>       
      </CardHeader>       
      <CardContent className="flex-1 pb-0">         
        <ChartContainer           
          config={chartConfig}           
          className="mx-auto aspect-square max-h-[250px] h-[100px]["         
        >           
          <PieChart className='h-[50px]' >             
            <ChartTooltip               
              cursor={false}               
              content={<ChartTooltipContent hideLabel />}             
            />             
            <Pie               
              data={chartData}               
              dataKey="visitors"               
              nameKey="browser"               
              innerRadius={60}             
            />           
          </PieChart>         
        </ChartContainer>       
      </CardContent>       
      <CardFooter className="flex-col gap-2 text-sm">         
       
        <Button variant="link" onClick={handleViewDetailsClick} className="text-blue-600">  View Details<TrendingUp/></Button>
      </CardFooter>     

      {/* Dialog to show the details table */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-6xl h-[85vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-background z-10 pb-6">
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
  Today&apos;s Income and Expenses
</DialogTitle>

          </DialogHeader>

          <div className="rounded-lg border bg-white shadow-lg">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-200 to-gray-300">
                    <TableHead className="font-semibold text-base text-gray-800 p-4 text-left">Class</TableHead>
                    <TableHead className="font-semibold text-base text-gray-800 p-4 text-left">Section</TableHead>
                    <TableHead className="font-semibold text-base text-gray-800 p-4 text-left">Total Students</TableHead>
                    <TableHead className="font-semibold text-base text-gray-800 p-4 text-left">Total Amount</TableHead>
                    <TableHead className="font-semibold text-base text-gray-800 p-4 text-left">Concession</TableHead>
                    <TableHead className="font-semibold text-base text-gray-800 p-4 text-left">Due Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.map((row, index) => (
                    <TableRow key={index} className="hover:bg-gray-100 transition-all">
                      <TableCell className="text-base text-gray-700 p-4">{row.class}</TableCell>
                      <TableCell className="text-base text-gray-700 p-4">{row.section}</TableCell>
                      <TableCell className="text-base text-gray-700 p-4">{row.totalStudents}</TableCell>
                      <TableCell className="text-base text-gray-700 p-4">₹{row.totalAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-base text-gray-700 p-4">₹{row.concession.toLocaleString()}</TableCell>
                      <TableCell className="text-base text-gray-700 p-4">₹{row.dueAmount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  ) 
}
