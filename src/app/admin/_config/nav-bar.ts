import {
  IconBuilding,
  IconCalendar,
  IconCalendarOff,
  IconDashboard,
  IconSettings,
  IconTruck,
  IconUsers,
} from "@tabler/icons-react";

export const mainMenuItems = [
  {
    name: "Dashboard",
    url: "/",

    icon: IconDashboard,
  },
  {
    name: "Tipos de Entrega",
    url: "/tipos-de-entrega",
    icon: IconTruck,
  },
  {
    name: "Agenda",
    url: "/agenda",
    icon: IconCalendar,
  },

  {
    name: "Disponibilidade",
    url: "/disponibilidade",
    icon: IconCalendarOff,
  },

  {
    name: "Usuários",
    url: "/usuarios",
    icon: IconUsers,
  },
  {
    name: "Configurações",
    url: "/configuracoes",
    icon: IconSettings,
  },
];
