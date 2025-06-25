import { createColumnConfigHelper } from "@/components/data-table/core/filters";
import { Key, Mail, UserCheck, Users, Calendar } from "lucide-react";
import type { User } from "@prisma/client";

const dtf = createColumnConfigHelper<User>();

export const columnsConfig = [
  dtf
    .text()
    .id("name")
    .displayName("Name")
    .icon(Users)
    .accessor((user) => user.name)
    .build(),
  dtf
    .text()
    .id("email")
    .displayName("Email")
    .icon(Mail)
    .accessor((user) => user.email)
    .build(),
  dtf
    .option()
    .id("role")
    .displayName("Role")
    .icon(Key)
    .accessor((user) => user.role)
    .options([
      { label: "Administrador", value: "ADMIN" },
      { label: "Usuário", value: "USER" },
    ])
    .build(),
  dtf
    .option()
    .id("isActive")
    .displayName("Status")
    .icon(UserCheck)
    .accessor((user) => (user.isActive ? "Active" : "Inactive"))
    .options([
      { label: "Active", value: "Active" },
      { label: "Inactive", value: "Inactive" },
    ])
    .build(),
  dtf
    .date()
    .id("createdAt")
    .displayName("Created At")
    .icon(Calendar)
    .accessor((row) => (row.createdAt ? new Date(row.createdAt) : new Date()))
    .build(),
];
