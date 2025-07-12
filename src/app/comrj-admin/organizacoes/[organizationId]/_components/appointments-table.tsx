"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Appointment, DeliveryType, User } from "@prisma/client";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
dayjs.locale("pt-br");

type AppointmentWithRelations = Appointment & {
  deliveryType: DeliveryType;
  user: User;
};

interface AppointmentsTableProps {
  organizationId: string;
}

const columnHelper = createColumnHelper<AppointmentWithRelations>();

const columns = [
  columnHelper.accessor("internalId", {
    header: "ID Interno",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("date", {
    header: "Data",
    cell: (info) => dayjs(info.getValue()).format("DD/MM/YYYY HH:mm"),
  }),
  columnHelper.accessor("deliveryType.name", {
    header: "Tipo de Entrega",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("user.name", {
    header: "Usuário",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => <Badge>{info.getValue()}</Badge>,
  }),
];

async function getAppointments(
  organizationId: string,
): Promise<AppointmentWithRelations[]> {
  const response = await fetch(
    `/api/organizations/${organizationId}/appointments`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch appointments");
  }
  return response.json();
}

export function AppointmentsTable({ organizationId }: AppointmentsTableProps) {
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["appointments", organizationId],
    queryFn: () => getAppointments(organizationId),
  });

  const table = useReactTable({
    data: appointments,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <div>Carregando agendamentos...</div>;

  return (
    <div className="rounded-md border bg-white dark:bg-inherit">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Nenhum agendamento encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
