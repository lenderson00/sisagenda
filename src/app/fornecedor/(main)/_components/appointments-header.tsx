"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/use-user";
import {
  CalendarDays,
  ChevronDown,
  LayoutGrid,
  List,
  Plus,
} from "lucide-react";
import Link from "next/link";

interface AppointmentsHeaderProps {
  viewMode: "list" | "calendar";
  onViewModeChange: (mode: "list" | "calendar") => void;
}

export function AppointmentsHeader({
  viewMode,
  onViewModeChange,
}: AppointmentsHeaderProps) {
  const { user } = useUser();
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Agendamentos {user?.name && `- ${user.name}`}
        </h1>
        <Link href="/agendar">
          <Button className="bg-black text-white hover:bg-gray-800">
            <Plus className="mr-2 h-4 w-4" />
            Novo Agendamento
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-end mb-4">
        <div className="flex items-center border border-gray-300 rounded-md bg-white">
          <Button
            variant="ghost"
            size="sm"
            title="List View"
            className={`p-2 rounded-none border-r border-gray-300 ${
              viewMode === "list"
                ? "text-gray-900 bg-gray-100"
                : "text-gray-400 hover:bg-gray-100"
            }`}
            onClick={() => onViewModeChange("list")}
          >
            <List className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title="Calendar View"
            className={`p-2 rounded-l-none ${
              viewMode === "calendar"
                ? "text-gray-900 bg-gray-100"
                : "text-gray-400 hover:bg-gray-100"
            }`}
            onClick={() => onViewModeChange("calendar")}
          >
            <CalendarDays className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
