"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Appointment,
  AppointmentActivity,
  DeliveryType,
} from "@prisma/client";
import {
  BarChart2,
  Calendar,
  Clock,
  Eye,
  MapPin,
  MoreHorizontal,
  User,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AppointmentsListView } from "./appointments-list-view";

type AppointmentWithRelations = Appointment & {
  deliveryType: DeliveryType;
  activities: AppointmentActivity[];
};

interface AppointmentsListProps {
  initialAppointments: AppointmentWithRelations[];
  viewMode?: "list" | "calendar";
  onViewModeChange?: (mode: "list" | "calendar") => void;
}

export function AppointmentsList({
  initialAppointments,
  viewMode = "list",
  onViewModeChange,
}: AppointmentsListProps) {
  const [appointments] = useState(initialAppointments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const matchesSearch =
        appointment.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.organizationId
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || appointment.deliveryTypeId === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchTerm, statusFilter]);

  const sortedAppointments = useMemo(() => {
    return [...filteredAppointments].sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "status":
          return a.deliveryTypeId.localeCompare(b.deliveryTypeId);
        case "client":
          return a.userId.localeCompare(b.userId);
        default:
          return 0;
      }
    });
  }, [filteredAppointments, sortBy]);

  const paginatedAppointments = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedAppointments.slice(startIndex, startIndex + pageSize);
  }, [sortedAppointments, currentPage, pageSize]);

  const getStatusColor = (deliveryTypeId: string) => {
    // You might want to map deliveryTypeId to a status color
    return "bg-gray-100 text-gray-700 border-gray-300";
  };

  const getAppointmentIcon = (appointment: AppointmentWithRelations) => {
    // Use the first letter of the delivery type name if available
    const firstChar =
      appointment.deliveryType?.name?.charAt(0).toUpperCase() || "A";
    if (["A", "B", "C"].includes(firstChar)) {
      return (
        <div className="h-5 w-5 bg-pink-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">
          {firstChar}
        </div>
      );
    }
    if (["X", "Y", "Z"].includes(firstChar)) {
      return (
        <div className="h-5 w-5 bg-purple-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">
          {firstChar}
        </div>
      );
    }
    return (
      <div className="h-5 w-5 bg-gray-300 rounded-sm flex items-center justify-center text-gray-600 text-xs font-bold">
        🗓️
      </div>
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Render grid view
  const renderGridView = () => (
    <div className="grid gap-6 md:grid-cols-2">
      {paginatedAppointments.map((appointment) => (
        <Card key={appointment.id} className="bg-white border-gray-200">
          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {getAppointmentIcon(appointment)}
                <div>
                  <Link
                    href={`/agendamento/${appointment.id}`}
                    className="hover:underline"
                  >
                    <h3 className="text-sm font-semibold text-gray-900">
                      {appointment.deliveryType?.name || "Appointment"}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-500">
                    User ID: {appointment.userId}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-gray-600"
                >
                  <BarChart2 className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-gray-600"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/agendamento/${appointment.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View Details</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit Appointment</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                <span>
                  {new Date(appointment.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <Badge
                variant="outline"
                className={`text-xs px-2 py-0.5 ${getStatusColor(appointment.deliveryTypeId)}`}
              >
                {appointment.deliveryType?.name || "Unknown Type"}
              </Badge>
            </div>

            {/* Last activity */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <Avatar className="h-5 w-5">
                  <AvatarImage
                    src={`/placeholder.svg?height=20&width=20&text=${appointment.userId.charAt(0)}`}
                  />
                  <AvatarFallback className="text-xs">
                    {appointment.userId.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span>User {appointment.userId}</span>
                <span className="text-gray-400">•</span>
                <span>
                  Updated{" "}
                  {new Date(appointment.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="text-xs text-gray-700 truncate">
                {appointment.observations
                  ? JSON.stringify(appointment.observations)
                  : "No observations"}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
                className="pl-10 bg-white border-gray-300"
              />
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1); // Reset to first page when filtering
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px] bg-white border-gray-300">
                <SelectValue placeholder="Filter by delivery type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {appointments
                  .map((app) => app.deliveryType)
                  .filter(
                    (type, index, self) =>
                      type &&
                      index === self.findIndex((t) => t?.id === type.id),
                  )
                  .map((type) => (
                    <SelectItem key={type?.id} value={type?.id || ""}>
                      {type?.name || "Unknown"}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value);
                setCurrentPage(1); // Reset to first page when sorting
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px] bg-white border-gray-300">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="status">Delivery Type</SelectItem>
                <SelectItem value="client">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* View Toggle is handled by the parent component */}

      {/* Appointments List or Grid */}
      {viewMode === "list" ? (
        <AppointmentsListView
          appointments={paginatedAppointments}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          totalAppointments={filteredAppointments.length}
        />
      ) : (
        <>
          {renderGridView()}
          {/* Pagination for Grid View */}
          {filteredAppointments.length > pageSize && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>
                  Showing {(currentPage - 1) * pageSize + 1}-
                  {Math.min(
                    currentPage * pageSize,
                    filteredAppointments.length,
                  )}{" "}
                  of {filteredAppointments.length}
                </span>
                <select
                  className="h-8 rounded-md border border-gray-300 bg-white px-2 text-xs"
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                >
                  <option value="6">6 per page</option>
                  <option value="10">10 per page</option>
                  <option value="20">20 per page</option>
                  <option value="50">50 per page</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from(
                  {
                    length: Math.min(
                      Math.ceil(filteredAppointments.length / pageSize),
                      5,
                    ),
                  },
                  (_, i) => i + 1,
                ).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={
                    currentPage ===
                    Math.ceil(filteredAppointments.length / pageSize)
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
