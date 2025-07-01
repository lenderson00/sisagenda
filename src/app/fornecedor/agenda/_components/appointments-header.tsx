"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser } from "@/hooks/use-user";
import { IconDownload } from "@tabler/icons-react";
import {
  CalendarDays,
  ChevronDown,
  LayoutGrid,
  List,
  Plus,
} from "lucide-react";
import Link from "next/link";
import type { AppointmentWithRelations } from "../page";
import { AppointmentsExport } from "./appointments-export";
import { ViewToggle } from "./view-toggle";

export function AppointmentsHeader() {
  const { user } = useUser();

  return (
    <>
      <PageHeader
        title={`  Agendamentos ${user?.name ? `- ${user.name}` : ""}`}
        subtitle={""}
      >
        <div className="flex items-center gap-2">
          <ViewToggle />
          <AppointmentsExport />
          <Link href="/agendar">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Agendamento
            </Button>
          </Link>
        </div>
      </PageHeader>
    </>
  );
}
