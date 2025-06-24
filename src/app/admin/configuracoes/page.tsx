import { PageHeader } from "@/components/page-header";

const ConfiguracoesPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <PageHeader
        title="Configurações"
        subtitle="Gerencie as configurações do sistema"
      />
      <div className="flex flex-col gap-4 p-4">{children}</div>
    </>
  );
};

export default ConfiguracoesPage;
