"use client";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef, CellContext } from "@tanstack/react-table";
import { format } from "date-fns";
import type { User } from "@prisma/client";
import { UserActions } from "./user-actions";

export const tstColumnsDefs: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: (info: CellContext<User, unknown>) => info.getValue() as string,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: (info: CellContext<User, unknown>) => info.getValue() as string,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: (info: CellContext<User, unknown>) => info.getValue() as string,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: (info: CellContext<User, unknown>) => {
      const isActive = info.getValue() === "Active";
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {info.getValue() as string}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: (info: CellContext<User, unknown>) => {
      const value = info.getValue();
      return value ? format(new Date(value as string), "dd/MM/yyyy") : "-";
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const user = row.original;
      const { meta } = table.options;
      if (
        !meta?.handleActivate ||
        !meta.handleDeactivate ||
        !meta.handleDelete ||
        !meta.handleResetPassword
      ) {
        return null;
      }
      return (
        <div className="flex justify-end">
          <UserActions
            user={user}
            onActivate={meta.handleActivate}
            onDeactivate={meta.handleDeactivate}
            onDelete={meta.handleDelete}
            onResetPassword={meta.handleResetPassword}
          />
        </div>
      );
    },
  },
];
