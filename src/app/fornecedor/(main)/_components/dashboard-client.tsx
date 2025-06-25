"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { AppointmentStatus } from "@prisma/client";
import { getStatusLabel } from "@/lib/dashboard-utils";
import ActivityCalendarWrapper from "./activity-calendar-wrapper";

interface Appointment {
  id: string;
  date: Date;
  status: AppointmentStatus;
  deliveryType: { name: string } | null;
  organization: { name: string } | null;
}

interface Activity {
  date: string;
  count: number;
  level: number;
}

interface DashboardStats {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  todayAppointments: number;
  weekAppointments: number;
  monthAppointments: number;
}

interface DashboardClientProps {
  supplier: {
    name: string | null;
    email: string;
    whatsapp: string | null;
    cnpj: string | null;
    address: string | null;
    createdAt: Date;
  } | null;
  appointments: Appointment[];
  stats: DashboardStats;
  activity: Activity[];
  pieData: { name: string; value: number }[];
  barData: { month: string; count: number }[];
  years: number[];
  selectedYear: number;
}

const COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Green
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#3b82f6", // Blue
  "#a21caf", // Purple
  "#f43f5e", // Pink
  "#0ea5e9", // Sky
];

export default function DashboardClient({
  supplier,
  appointments,
  stats,
  activity,
  pieData,
  barData,
  years,
  selectedYear,
}: DashboardClientProps) {
  return (
    <div className="flex flex-row gap-8 p-4">
      {/* Year Tabs */}
      <div className="flex flex-col gap-2 min-w-[80px]">
        {years.map((year) => (
          <a
            key={year}
            href={`?year=${year}`}
            className={`px-4 py-2 rounded-lg text-center font-semibold transition-colors ${year === selectedYear ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}
          >
            {year}
          </a>
        ))}
      </div>
      {/* Dashboard Content */}
      <div className="flex-1 flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Profile</CardTitle>
              <CardDescription>
                Basic information about your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div>
                  <b>Name:</b> {supplier?.name}
                </div>
                <div>
                  <b>Email:</b> {supplier?.email}
                </div>
                <div>
                  <b>WhatsApp:</b> {supplier?.whatsapp || "-"}
                </div>
                <div>
                  <b>CNPJ:</b> {supplier?.cnpj || "-"}
                </div>
                <div>
                  <b>Address:</b> {supplier?.address || "-"}
                </div>
                <div>
                  <b>Account created:</b>{" "}
                  {supplier?.createdAt
                    ? format(new Date(supplier.createdAt), "dd/MM/yyyy")
                    : "-"}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Appointment Stats</CardTitle>
              <CardDescription>Overview of your appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Stat label="Total" value={stats.totalAppointments} />
                <Stat label="Pending" value={stats.pendingAppointments} />
                <Stat label="Confirmed" value={stats.confirmedAppointments} />
                <Stat label="Completed" value={stats.completedAppointments} />
                <Stat label="Cancelled" value={stats.cancelledAppointments} />
                <Stat label="Today" value={stats.todayAppointments} />
                <Stat label="This week" value={stats.weekAppointments} />
                <Stat label="This month" value={stats.monthAppointments} />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Appointments by Month</CardTitle>
              <CardDescription>
                Distribution of appointments throughout the year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Appointments by Status</CardTitle>
              <CardDescription>
                Distribution of appointment statuses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Activity Calendar</CardTitle>
            <CardDescription>
              Visualize your appointment activity per day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityCalendarWrapper activity={activity} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
            <CardDescription>Your last 10 appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Delivery Type</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.slice(0, 10).length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground"
                    >
                      No appointments found
                    </TableCell>
                  </TableRow>
                ) : (
                  appointments.slice(0, 10).map((apt) => (
                    <TableRow key={apt.id}>
                      <TableCell>
                        {format(new Date(apt.date), "dd/MM/yyyy HH:mm")}
                      </TableCell>
                      <TableCell>{apt.deliveryType?.name}</TableCell>
                      <TableCell>{apt.organization?.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getStatusLabel(apt.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center justify-center bg-muted rounded-lg p-4">
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
