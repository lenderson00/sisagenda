"use client";

import { createColumnConfigHelper } from "@/components/data-table/core/filters";
import { IconBuilding, IconCalendar, IconUser } from "@tabler/icons-react";
import type { Organization } from "@prisma/client";

type OrganizationResponse = Organization & {
  comimsup: {
    name: string;
  };
};

const dtf = createColumnConfigHelper<OrganizationResponse>();

export const columnsConfig = [
  // Name Column
  dtf
    .text()
    .id("name")
    .displayName("Nome")
    .icon(IconBuilding)
    .accessor((row) => row.name)
    .build(),

  // Sigla Column
  dtf
    .text()
    .id("sigla")
    .displayName("Sigla")
    .icon(IconBuilding)
    .accessor((row) => row.sigla)
    .build(),

  // COMIMSUP Column
  dtf
    .option()
    .id("comimsup")
    .displayName("COMIMSUP")
    .icon(IconUser)
    .accessor((row) => row.comimsup?.name || "Não informado")
    .transformOptionFn((value) => ({
      label: value,
      value: value,
    }))
    .build(),

  // Role Column
  dtf
    .option()
    .id("role")
    .displayName("Papel")
    .icon(IconUser)
    .accessor((row) => row.role)
    .options([
      {
        label: "Depósito",
        value: "DEPOSITO",
      },
      {
        label: "COMIMSUP",
        value: "COMIMSUP",
      },
      {
        label: "COMRJ",
        value: "COMRJ",
      },
    ])
    .build(),

  // Created At Column
  dtf
    .date()
    .id("createdAt")
    .displayName("Criado em")
    .icon(IconCalendar)
    .accessor((row) => new Date(row.createdAt))
    .build(),
];
