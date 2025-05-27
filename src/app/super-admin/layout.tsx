import { TopNavigation } from "@/components/top-navigation";

const tabs = [
  { label: "Organizações Militares", href: "/" },
  { label: "Configurações", href: "/configuracoes" },
];

const SuperAdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      <TopNavigation tabs={tabs} />
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
};

export default SuperAdminLayout;
