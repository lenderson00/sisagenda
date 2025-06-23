"use client";

import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import {
  type AppointmentColumn,
  columns,
  transformAppointmentToColumn,
} from "./columns";

// Assuming a more complete type is returned from the API now.
import type {
  Appointment,
  DeliveryType,
  Organization,
  User,
} from "@prisma/client";
type FullAppointment = Appointment & {
  organization: Organization;
  user: User;
  deliveryType: DeliveryType;
};

export const AgendamentosClient = () => {
  const [data, setData] = useState<AppointmentColumn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/appointments");
        const appointments: FullAppointment[] = await res.json();
        setData(appointments.map(transformAppointmentToColumn));
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Agendamentos ({data.length})
          </h2>
          <p className="text-muted-foreground">
            Gerencie os agendamentos do sistema.
          </p>
        </div>
      </div>
      <Separator className="my-4" />
      <DataTable
        columns={columns}
        data={data}
        searchKey="organizationName"
        loading={loading}
      />
    </>
  );
};
