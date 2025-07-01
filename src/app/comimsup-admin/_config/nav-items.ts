import {
  IconBuilding,
  IconCalendar,
  IconDashboard,
  IconMessageCircle,
  IconSearch,
  type TablerIcon,
} from "@tabler/icons-react";

export const comimsupAdminNavItems: {
  name: string;
  url: string;
  icon: TablerIcon;
}[] = [
  {
    name: "Dashboard",
    url: "/",
    icon: IconDashboard,
  },
  {
    name: "Agendamentos",
    url: "/agenda",
    icon: IconCalendar,
  },
  {
    name: "Consulta Parametrizada",
    url: "/consulta",
    icon: IconSearch,
  },
  {
    name: "Chat",
    url: "/chat",
    icon: IconMessageCircle,
  },
];
