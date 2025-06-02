import Footer from "@/components/footer";
import { TopNavigation } from "@/components/top-navigation";

const tabs = [
  { label: "Agendamentos", href: "/" },
  { label: "Configurações", href: "/configuracoes" },
];

const FornecedorLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      <TopNavigation tabs={tabs} />
      <div className="min-h-[60vh] bg-neutral-50">{children}</div>
      <Footer />
    </div>
  );
};

export default FornecedorLayout;
