"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface SupplierPerformanceData {
  name: string;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  completionRate: number;
}

interface SupplierPerformanceChartProps {
  data: SupplierPerformanceData[];
  className?: string;
}

export function SupplierPerformanceChart({
  data,
  className,
}: SupplierPerformanceChartProps) {
  const chartConfig = {
    totalAppointments: {
      label: "Total Appointments",
      color: "hsl(var(--chart-1))",
    },
    completedAppointments: {
      label: "Completed",
      color: "hsl(var(--chart-2))",
    },
    cancelledAppointments: {
      label: "Cancelled",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Supplier Performance</CardTitle>
        <CardDescription>
          Appointment completion rates by supplier
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <YAxis tickLine={false} axisLine={false} className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="totalAppointments"
                fill="var(--color-totalAppointments)"
                name="Total"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="completedAppointments"
                fill="var(--color-completedAppointments)"
                name="Completed"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="cancelledAppointments"
                fill="var(--color-cancelledAppointments)"
                name="Cancelled"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
