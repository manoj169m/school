import { useState } from "react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { FeesDetailsDialog } from "./ReceivablesTable";

const chartData = [{ month: "january", Yet_to_collect: 1260, collected: 570 }];

const chartConfig = {
  collected: {
    label: "Collected",
    color: "hsl(var(--chart-2))",
  },
  Yet_to_collect: {
    label: "Yet to Collect",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function Receivables() {
  const totalVisitors = chartData[0].collected + chartData[0].Yet_to_collect;
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold">Receivables</CardTitle>
        <CardDescription className="text-base">January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center justify-center py-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-square w-full max-w-[280px]"
        >
          <RadialBarChart
            className="text-center"
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={140}
          >
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 12}
                          className="fill-foreground text-2xl font-bold"
                        >
                          ₹{totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 12}
                          className="fill-muted-foreground text-sm"
                        >
                          Total Receivables
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="collected"
              stackId="a"
              cornerRadius={4}
              fill="var(--color-collected)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="Yet_to_collect"
              fill="var(--color-Yet_to_collect)"
              stackId="a"
              cornerRadius={4}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="pt-0">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full text-base font-medium hover:bg-muted/80"
            >
              View Details
            </Button>
          </DialogTrigger>
          <FeesDetailsDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        </Dialog>
      </CardFooter>
    </Card>
  );
}