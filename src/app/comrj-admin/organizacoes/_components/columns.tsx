import { createColumnConfigHelper } from "@/components/data-table/core/filters";
import { Building, CheckCircle, FileText, TrendingUp } from "lucide-react";

// Extended Organization type with appointment statistics
export type OrganizationWithStats = {
  id: string;
  name: string;
  sigla: string;
  description: string | null;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  totalAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
};

const dtf = createColumnConfigHelper<OrganizationWithStats>();

export const columnsConfig = [
  dtf
    .text()
    .id("name")
    .displayName("Nome")
    .icon(Building)
    .accessor((org) => org.name)
    .build(),
  dtf
    .text()
    .id("sigla")
    .displayName("Sigla")
    .icon(Building)
    .accessor((org) => org.sigla)
    .build(),
  dtf
    .text()
    .id("description")
    .displayName("Descrição")
    .icon(FileText)
    .accessor((org) => org.description || "Sem descrição")
    .build(),
  dtf
    .number()
    .id("totalAppointments")
    .displayName("Total de Agendamentos")
    .icon(TrendingUp)
    .accessor((org) => org.totalAppointments)
    .build(),
  dtf
    .number()
    .id("completedAppointments")
    .displayName("Agendamentos Concluídos")
    .icon(CheckCircle)
    .accessor((org) => org.completedAppointments)
    .build(),
  dtf
    .number()
    .id("pendingAppointments")
    .displayName("Agendamentos Pendentes")
    .icon(Building)
    .accessor((org) => org.pendingAppointments)
    .build(),
];
