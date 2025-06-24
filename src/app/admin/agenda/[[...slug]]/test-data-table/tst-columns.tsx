import { createColumnHelper } from "@tanstack/react-table";
import type { AppointmentWithRelations } from "../page-client";
import { getStatusReadableName, getStatusColor } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import dayjs from "@/lib/dayjs";
import { cn } from "@/lib/utils";

const columnHelper = createColumnHelper<AppointmentWithRelations>();

export const tstColumnsDefs = [
  // Status Column
  columnHelper.accessor((row) => row.status, {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusColor = getStatusColor(row.original.status);
      return (
        <Link
          href={`/agendamentos/${row.original.id}`}
          className="hover:underline"
        >
          <Badge
            variant="outline"
            className={cn(
              "flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3 w-fit",
            )}
          >
            {getStatusReadableName(row.original.status)}
          </Badge>
        </Link>
      );
    },
  }),

  // Appointment Date Column
  columnHelper.accessor((row) => new Date(row.date), {
    id: "date",
    header: "Data de Agendamento",
    cell: ({ row }) => (
      <div className="w-32 text-muted-foreground">
        {dayjs(row.original.date).format("DD/MM/YYYY HH:mm")}
      </div>
    ),
  }),

  // Supplier Column
  columnHelper.accessor((row) => row.user.name, {
    id: "supplier",
    header: "Fornecedor",
    cell: ({ row }) => (
      <div className="w-32 text-muted-foreground">
        {row.original.user.name || "Não informado"}
      </div>
    ),
  }),

  // Delivery Type Column
  columnHelper.accessor((row) => row.deliveryType.name, {
    id: "deliveryType",
    header: "Tipo de Entrega",
    cell: ({ row }) => (
      <div className="w-32 text-muted-foreground">
        {row.original.deliveryType.name}
      </div>
    ),
  }),

  // Duration Column (display only, not filterable)
  columnHelper.accessor((row) => row.duration, {
    id: "duration",
    header: "Duração",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {(() => {
            const hours = Math.floor(row.original.duration / 60);
            const minutes = row.original.duration % 60;

            const parts = [];
            if (hours > 0) parts.push(`${hours} h`);
            if (minutes > 0) parts.push(`${minutes} m`);

            return parts.join(" ") || "0m";
          })()}
        </Badge>
      </div>
    ),
  }),

  // Purchase Order Column (additional useful column)
  columnHelper.accessor((row) => row.ordemDeCompra, {
    id: "ordemDeCompra",
    header: "Ordem de Compra",
    cell: ({ row }) => (
      <div className="text-sm min-w-[190px] truncate">
        {row.original.ordemDeCompra}
      </div>
    ),
  }),
];
