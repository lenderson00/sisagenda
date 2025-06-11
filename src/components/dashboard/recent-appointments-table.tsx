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
import { getStatusLabel } from "@/lib/dashboard-utils";
import { cn } from "@/lib/utils";
import { AppointmentStatus } from "@prisma/client";
import { format } from "date-fns";

interface RecentAppointment {
  id: string;
  date: Date;
  status: AppointmentStatus;
  user: {
    name: string | null;
  };
  deliveryType: {
    name: string;
  };
  internalId: string;
}

interface RecentAppointmentsTableProps {
  appointments: RecentAppointment[];
  className?: string;
}

const getStatusVariant = (status: AppointmentStatus) => {
  switch (status) {
    case AppointmentStatus.CONFIRMED:
      return "default";
    case AppointmentStatus.PENDING_CONFIRMATION:
      return "secondary";
    case AppointmentStatus.COMPLETED:
      return "outline";
    case AppointmentStatus.CANCELLED:
    case AppointmentStatus.REJECTED:
      return "destructive";
    default:
      return "secondary";
  }
};

export function RecentAppointmentsTable({
  appointments,
  className,
}: RecentAppointmentsTableProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Recent Appointments</CardTitle>
        <CardDescription>
          Latest appointment activities in your organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Delivery Type</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No recent appointments found
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">
                    {appointment.internalId}
                  </TableCell>
                  <TableCell>
                    {format(new Date(appointment.date), "dd/MM/yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                    {appointment.user.name || "Unnamed Supplier"}
                  </TableCell>
                  <TableCell>{appointment.deliveryType.name}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(appointment.status)}>
                      {getStatusLabel(appointment.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
