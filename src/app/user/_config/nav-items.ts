import {
  IconCalendar,
  IconDashboard,
  type TablerIcon,
} from "@tabler/icons-react";

export const userNavItems: {
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
];
