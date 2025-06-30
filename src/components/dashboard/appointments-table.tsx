"use client";

/**
 * AppointmentsTable Component
 *
 * This component displays appointments in a table format with three tabs:
 * - Today's appointments
 * - Tomorrow's appointments
 * - This week's appointments
 *
 * Usage:
 * ```tsx
 * import { getDashboardAppointments } from '@/lib/services/dashboard-service'
 * import { AppointmentsTable } from '@/components/dashboard/appointments-table'
 *
 * // In your page component:
 * const appointments = await getDashboardAppointments(organizationId)
 *
 * return (
 *   <AppointmentsTable
 *     todayAppointments={appointments.today}
 *     tomorrowAppointments={appointments.tomorrow}
 *     weekAppointments={appointments.week}
 *   />
 * )
 * ```
 */

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  LoaderIcon,
  MoreVerticalIcon,
  PlusIcon,
  ClockIcon,
  CalendarIcon,
  UserIcon,
  PackageIcon,
  FileTextIcon,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const appointmentSchema = z.object({
  id: z.string(),
  internalId: z.string(),
  date: z.date(),
  duration: z.number(),
  status: z.enum([
    "PENDING_CONFIRMATION",
    "CONFIRMED",
    "REJECTED",
    "CANCELLATION_REQUESTED",
    "CANCELLATION_REJECTED",
    "CANCELLED",
    "RESCHEDULE_REQUESTED",
    "RESCHEDULE_CONFIRMED",
    "RESCHEDULE_REJECTED",
    "RESCHEDULED",
    "COMPLETED",
    "SUPPLIER_NO_SHOW",
  ]),
  ordemDeCompra: z.string(),
  user: z.object({
    name: z.string().nullable(),
  }),
  deliveryType: z.object({
    name: z.string(),
  }),
  requesterName: z.string(),
});

type Appointment = z.infer<typeof appointmentSchema>;

function StatusBadge({ status }: { status: Appointment["status"] }) {
  const statusConfig = {
    PENDING_CONFIRMATION: {
      label: "Pendente",
      variant: "secondary" as const,
      icon: LoaderIcon,
    },
    CONFIRMED: {
      label: "Confirmado",
      variant: "default" as const,
      icon: CheckCircle2Icon,
    },
    REJECTED: {
      label: "Rejeitado",
      variant: "destructive" as const,
      icon: LoaderIcon,
    },
    CANCELLATION_REQUESTED: {
      label: "Cancelamento Solicitado",
      variant: "secondary" as const,
      icon: LoaderIcon,
    },
    CANCELLATION_REJECTED: {
      label: "Cancelamento Rejeitado",
      variant: "destructive" as const,
      icon: LoaderIcon,
    },
    CANCELLED: {
      label: "Cancelado",
      variant: "destructive" as const,
      icon: LoaderIcon,
    },
    RESCHEDULE_REQUESTED: {
      label: "Reagendamento Solicitado",
      variant: "secondary" as const,
      icon: LoaderIcon,
    },
    RESCHEDULE_CONFIRMED: {
      label: "Reagendamento Confirmado",
      variant: "default" as const,
      icon: CheckCircle2Icon,
    },
    RESCHEDULE_REJECTED: {
      label: "Reagendamento Rejeitado",
      variant: "destructive" as const,
      icon: LoaderIcon,
    },
    RESCHEDULED: {
      label: "Reagendado",
      variant: "default" as const,
      icon: CheckCircle2Icon,
    },
    COMPLETED: {
      label: "Concluído",
      variant: "default" as const,
      icon: CheckCircle2Icon,
    },
    SUPPLIER_NO_SHOW: {
      label: "Fornecedor Não Compareceu",
      variant: "destructive" as const,
      icon: LoaderIcon,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex gap-1 px-2 py-1">
      <Icon className="size-3" />
      {config.label}
    </Badge>
  );
}

const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "date",
    header: "Data e Hora",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <CalendarIcon className="size-4 text-muted-foreground" />
        <div className="flex flex-col">
          <span className="font-medium">
            {format(row.original.date, "dd/MM/yyyy", { locale: ptBR })}
          </span>
          <span className="text-sm text-muted-foreground">
            {format(row.original.date, "HH:mm", { locale: ptBR })}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "user.name",
    header: "Fornecedor",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <UserIcon className="size-4 text-muted-foreground" />
        <span>{row.original.user.name || "Nome não informado"}</span>
      </div>
    ),
  },
  {
    accessorKey: "deliveryType.name",
    header: "Tipo de Entrega",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <PackageIcon className="size-4 text-muted-foreground" />
        <span>{row.original.deliveryType.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "duration",
    header: "Duração",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <ClockIcon className="size-4 text-muted-foreground" />
        <span>{row.original.duration} min</span>
      </div>
    ),
  },
  {
    accessorKey: "ordemDeCompra",
    header: "Ordem de Compra",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FileTextIcon className="size-4 text-muted-foreground" />
        <span className="font-mono text-sm">{row.original.ordemDeCompra}</span>
      </div>
    ),
  },
];

interface AppointmentsTableProps {
  todayAppointments: Appointment[];
  tomorrowAppointments: Appointment[];
  weekAppointments: Appointment[];
}

export function AppointmentsTable({
  todayAppointments,
  tomorrowAppointments,
  weekAppointments,
}: AppointmentsTableProps) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const todayTable = useReactTable({
    data: todayAppointments,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const tomorrowTable = useReactTable({
    data: tomorrowAppointments,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const weekTable = useReactTable({
    data: weekAppointments,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function renderTable(table: any, title: string) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ColumnsIcon />
                  <span className="hidden lg:inline">Colunas</span>
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {table
                  .getAllColumns()
                  .filter(
                    (column: any) =>
                      typeof column.accessorFn !== "undefined" &&
                      column.getCanHide(),
                  )
                  .map((column: any) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {typeof column.columnDef.header === "string"
                          ? column.columnDef.header
                          : column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              {table.getHeaderGroups().map((headerGroup: any) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header: any) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row: any) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell: any) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-[250px] text-center bg-card"
                  >
                    Nenhum agendamento encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between px-4">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Linhas por página
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Página {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Ir para primeira página</span>
                <ChevronsLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Ir para página anterior</span>
                <ChevronLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Ir para próxima página</span>
                <ChevronRightIcon />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Ir para última página</span>
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Tabs
      defaultValue="today"
      className="flex w-full flex-col justify-start gap-2"
    >
      <div className="flex items-center justify-between ">
        <TabsList className="flex">
          <TabsTrigger value="today" className="gap-1">
            Hoje{" "}
            <Badge
              variant="secondary"
              className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/30"
            >
              {todayAppointments.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="tomorrow" className="gap-1">
            Amanhã{" "}
            <Badge
              variant="secondary"
              className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/30"
            >
              {tomorrowAppointments.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="week" className="gap-1">
            Esta Semana{" "}
            <Badge
              variant="secondary"
              className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/30"
            >
              {weekAppointments.length}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent
        value="today"
        className="relative flex flex-col gap-4 overflow-auto "
      >
        {renderTable(todayTable, "Agendamentos de Hoje")}
      </TabsContent>

      <TabsContent
        value="tomorrow"
        className="relative flex flex-col gap-4 overflow-auto "
      >
        {renderTable(tomorrowTable, "Agendamentos de Amanhã")}
      </TabsContent>

      <TabsContent
        value="week"
        className="relative flex flex-col gap-4 overflow-auto "
      >
        {renderTable(weekTable, "Agendamentos desta Semana")}
      </TabsContent>
    </Tabs>
  );
}
