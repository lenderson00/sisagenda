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
import { getStatusColor, getStatusLabel } from "@/lib/dashboard-utils";
import { cn } from "@/lib/utils";
import type { AppointmentStatus } from "@prisma/client";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface AppointmentStatusChartProps {
  data: Array<{
    status: AppointmentStatus;
    count: number;
  }>;
  className?: string;
}

export function AppointmentStatusChart({
  data,
  className,
}: AppointmentStatusChartProps) {
  const chartData = data.map((item) => ({
    name: getStatusLabel(item.status),
    value: item.count,
    fill: getStatusColor(item.status),
  }));

  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Appointment Status Distribution</CardTitle>
        <CardDescription>
          Overview of all appointment statuses ({total} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{}}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent || 0 * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip
                content={<ChartTooltipContent payload={[]} label={""} />}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
