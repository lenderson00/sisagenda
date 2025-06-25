import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useUser } from "@/hooks/use-user";
import { exportAppointmentsToPDF } from "@/lib/pdf-export";
import { IconDownload, IconLoader } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import type { AppointmentWithRelations } from "../page";

export function AppointmentsExport() {
  const { user } = useUser();

  const { data: appointments, isLoading } = useQuery<
    AppointmentWithRelations[]
  >({
    queryKey: ["appointments"],
    queryFn: () => fetch("/api/appointments").then((res) => res.json()),
  });

  if (!user) {
    return null;
  }

  const handleExport = () => {
    if (appointments) {
      exportAppointmentsToPDF(appointments, user);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger className="mr-2" asChild>
        <Button
          variant="outline"
          size="icon"
          disabled={isLoading || !appointments}
          onClick={handleExport}
        >
          {isLoading ? (
            <IconLoader className="h-4 w-4 animate-spin" />
          ) : (
            <IconDownload className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Baixar agendamentos</p>
      </TooltipContent>
    </Tooltip>
  );
}
