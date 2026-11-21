"use client"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { class: "Pre-KG",  paid: 5, balance: 10, concession: 5 },
  { class: "LKG",  paid: 7, balance: 8, concession: 4 },
  { class: "UKG",  paid: 6, balance: 9, concession: 5 },
  { class: "1st",  paid: 8, balance: 10, concession: 6 },
  { class: "2nd",  paid: 5, balance: 12, concession: 7 },
  { class: "3rd",  paid: 7, balance: 13, concession: 8 },
  { class: "4th",  paid: 10, balance: 8, concession: 6 },
  { class: "5th",  paid: 12, balance: 6, concession: 5 },
  { class: "6th",  paid: 15, balance: 5, concession: 4 },
  { class: "7th",  paid: 17, balance: 8, concession: 5 },
  { class: "8th",  paid: 20, balance: 5, concession: 6 },
  { class: "9th",  paid: 22, balance: 10, concession: 4 },
  { class: "10th",  paid: 25, balance: 5, concession: 3 },
  { class: "11th",  paid: 27, balance: 6, concession: 2 },
  { class: "12th",  paid: 30, balance: 7, concession: 1 },
]

const chartConfig = {
  paid: {
    label: "Paid",
    color: "#E76E50",
  },
  balance: {
    label: "Balance",
    color: "#008B8B",
  },
  concession: {
    label: "Concession",
    color: "#2A9D90",
  },
} satisfies ChartConfig

export function ClassAttendanceBarChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Class - Wise Finance Report</CardTitle>
        <CardDescription>Student Finance Status Across All Classes</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart width={800} height={300} data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="class"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
        
            <Bar
              dataKey="paid"
              stackId="a"
              fill="var(--color-paid)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="balance"
              stackId="a"
              fill="var(--color-balance)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="concession"
              stackId="a"
              fill="var(--color-concession)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default ClassAttendanceBarChart
