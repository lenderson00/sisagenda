"use client";

import { createColumnConfigHelper } from "@/components/data-table/core/filters";
import type { Supplier } from "@prisma/client";
import { Building, Calendar, Mail, Phone, ToggleLeft } from "lucide-react";

const dtf = createColumnConfigHelper<Supplier>();

export const columnsConfig = [
  dtf
    .text()
    .id("name")
    .displayName("Nome")
    .icon(Building)
    .accessor((supplier) => supplier.name)
    .build(),
  dtf
    .text()
    .id("cnpj")
    .displayName("CNPJ")
    .icon(Building)
    .accessor((supplier) => supplier.cnpj)
    .build(),
  dtf
    .text()
    .id("email")
    .displayName("Email")
    .icon(Mail)
    .accessor((supplier) => supplier.email)
    .build(),
  dtf
    .text()
    .id("whatsapp")
    .displayName("WhatsApp")
    .icon(Phone)
    .accessor((supplier) => supplier.whatsapp || "N/A")
    .build(),
  dtf
    .option()
    .id("isActive")
    .displayName("Status")
    .icon(ToggleLeft)
    .accessor((supplier) => (supplier.isActive ? "Ativo" : "Inativo"))
    .options([
      { label: "Ativo", value: "Ativo" },
      { label: "Inativo", value: "Inativo" },
    ])
    .build(),
  dtf
    .date()
    .id("createdAt")
    .displayName("Criado em")
    .icon(Calendar)
    .accessor((supplier) =>
      supplier.createdAt ? new Date(supplier.createdAt) : new Date(),
    )
    .build(),
];
