"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  Appointment,
  AppointmentActivity,
  DeliveryType,
} from "@prisma/client";
import {
  AlertTriangle,
  Calendar,
  Clock,
  Edit,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type AppointmentWithRelations = Appointment & {
  deliveryType: DeliveryType;
  activities: AppointmentActivity[];
};

interface AppointmentsListViewProps {
  appointments: AppointmentWithRelations[];
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  totalAppointments: number;
}

export function AppointmentsListView({
  appointments,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  totalAppointments,
}: AppointmentsListViewProps) {
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>(
    [],
  );

  const getStatusColor = (deliveryTypeId: string) => {
    // You might want to map deliveryTypeId to a status color
    return "bg-gray-100 text-gray-700 border-gray-300";
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const toggleSelectAll = () => {
    if (selectedAppointments.length === appointments.length) {
      setSelectedAppointments([]);
    } else {
      setSelectedAppointments(
        appointments.map((appointment) => appointment.id),
      );
    }
  };

  const toggleSelectAppointment = (id: string) => {
    if (selectedAppointments.includes(id)) {
      setSelectedAppointments(
        selectedAppointments.filter((appointmentId) => appointmentId !== id),
      );
    } else {
      setSelectedAppointments([...selectedAppointments, id]);
    }
  };

  const totalPages = Math.ceil(totalAppointments / pageSize);

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedAppointments.length === appointments.length &&
                    appointments.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all appointments"
                />
              </TableHead>
              <TableHead className="w-[180px]">Date & Time</TableHead>
              <TableHead>Client & Title</TableHead>
              <TableHead className="hidden md:table-cell">
                Organization
              </TableHead>
              <TableHead className="w-[120px]">Delivery Type</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id} className="hover:bg-gray-50">
                <TableCell>
                  <Checkbox
                    checked={selectedAppointments.includes(appointment.id)}
                    onCheckedChange={() =>
                      toggleSelectAppointment(appointment.id)
                    }
                    aria-label={`Select appointment ${appointment.id}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-gray-500" />
                      <span>{formatDate(appointment.date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{appointment.date.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{appointment.userId}</div>
                    <div className="text-sm text-gray-500 truncate max-w-[250px]">
                      {appointment.observations
                        ? JSON.stringify(appointment.observations)
                        : "No observations"}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="text-sm text-gray-600 truncate max-w-[200px]">
                    {appointment.organizationId}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-xs px-2 py-0.5 ${getStatusColor(appointment.deliveryTypeId)}`}
                  >
                    {appointment.deliveryType?.name || "Unknown Type"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/appointments/${appointment.id}`}
                          className="flex items-center"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {appointments.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No appointments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalAppointments > pageSize && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>
              Showing {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, totalAppointments)} of{" "}
              {totalAppointments}
            </span>
            <select
              className="h-8 rounded-md border border-gray-300 bg-white px-2 text-xs"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from(
              { length: Math.min(totalPages, 5) },
              (_, i) => i + 1,
            ).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
