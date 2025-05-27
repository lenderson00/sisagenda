import Footer from "@/components/footer";
import { TopNavigation } from "@/components/top-navigation";

const tabs = [
  { label: "Dashboard", href: "/" },
  { label: "Agendamentos", href: "/agendamentos" },
  { label: "Usuários", href: "/usuarios" },
  { label: "Fornecedores", href: "/fornecedores" },
  { label: "Configurações", href: "/configuracoes" },
];

const SuperAdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      <TopNavigation tabs={tabs} />
      <div className="min-h-[80vh] bg-neutral-50">{children}</div>
      <Footer />
    </div>
  );
};

export default SuperAdminLayout;
