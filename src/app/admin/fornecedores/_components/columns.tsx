import { createColumnConfigHelper } from "@/components/data-table/core/filters";
import {
  Building,
  Calendar,
  CheckCircle,
  Mail,
  Phone,
  Hash,
} from "lucide-react";
import type { Supplier } from "../page-client";

const dtf = createColumnConfigHelper<Supplier>();

// CNPJ mask function for display
function formatCnpj(cnpj: string): string {
  if (!cnpj) return "N/A";
  const numbers = cnpj.replace(/\D/g, "");
  if (numbers.length !== 14) return cnpj;
  return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
}

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
    .icon(Hash)
    .accessor((supplier) => formatCnpj(supplier.cnpj || ""))
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
    .id("phone")
    .displayName("Telefone")
    .icon(Phone)
    .accessor((supplier) => supplier.phone)
    .build(),
  dtf
    .option()
    .id("isActive")
    .displayName("Status")
    .icon(CheckCircle)
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
    .accessor((row) => (row.createdAt ? new Date(row.createdAt) : new Date()))
    .build(),
];
