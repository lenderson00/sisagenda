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
import type { TimeSeriesData } from "@/lib/dashboard-utils";
import { cn } from "@/lib/utils";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface AppointmentsTimelineChartProps {
  data: TimeSeriesData[];
  title?: string;
  description?: string;
  className?: string;
}

export function AppointmentsTimelineChart({
  data,
  title = "Appointments Timeline",
  description = "Daily appointment trends over the last 7 days",
  className,
}: AppointmentsTimelineChartProps) {
  const chartConfig = {
    appointments: {
      label: "Total Appointments",
      color: "hsl(var(--chart-1))",
    },
    confirmed: {
      label: "Confirmed",
      color: "hsl(var(--chart-2))",
    },
    cancelled: {
      label: "Cancelled",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <YAxis tickLine={false} axisLine={false} className="text-xs" />
              <ChartTooltip
                content={<ChartTooltipContent payload={[]} label={""} />}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="appointments"
                stroke="var(--color-appointments)"
                strokeWidth={2}
                dot={{ fill: "var(--color-appointments)" }}
                name="Total Appointments"
              />
              <Line
                type="monotone"
                dataKey="confirmed"
                stroke="var(--color-confirmed)"
                strokeWidth={2}
                dot={{ fill: "var(--color-confirmed)" }}
                name="Confirmed"
              />
              <Line
                type="monotone"
                dataKey="cancelled"
                stroke="var(--color-cancelled)"
                strokeWidth={2}
                dot={{ fill: "var(--color-cancelled)" }}
                name="Cancelled"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
