import Footer from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { TopBar } from "@/components/top-bar";
import { TopNavigation } from "@/components/top-navigation";

const tabs = [
  { label: "Agendamentos", href: "/" },
  { label: "Configurações", href: "/configuracoes" },
];

const FornecedorLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      <SiteHeader />
      <div className="min-h-[60vh] bg-neutral-50 dark:bg-neutral-900 px-4 ">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default FornecedorLayout;
