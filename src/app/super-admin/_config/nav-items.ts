import {
  IconBuilding,
  IconSettings,
  IconShield,
  IconUser,
  type TablerIcon,
} from "@tabler/icons-react";

export const superAdminNavItems: {
  name: string;
  url: string;
  icon: TablerIcon;
}[] = [
    {
      name: "Organizações",
      url: "/",
      icon: IconBuilding,
    },
    {
      name: "Permissões",
      url: "/permissoes",
      icon: IconShield,
    },
  ];
