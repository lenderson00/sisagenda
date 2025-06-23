import {
  IconCalendar,
  IconChevronDown,
  IconDeviceFloppy,
  IconFilter,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/page-header";
import { EmptyScreen } from "./_components/empty-screen";
import { notFound } from "next/navigation";
import Link from "next/link";

type Params = {
  slug: string[];
};

const AvailableTabs = ["proximos", "nao-confirmado", "anteriores", "cancelado"];

const AgendamentosPage = async ({ params }: { params: Promise<Params> }) => {
  const { slug } = await params;

  if (
    Array.isArray(slug) &&
    (slug.length > 1 || !AvailableTabs.includes(slug[0]))
  ) {
    notFound();
  }

  const tab = Array.isArray(slug) ? slug[0] : "proximos";

  const renderContent = () => {
    switch (tab) {
      case "proximos":
        return (
          <EmptyScreen
            Icon={IconCalendar}
            headline="Ainda não tem reservas próximos"
            description="Você não possui reservas próximos. Assim que alguém reservar uma hora, ela aparecerá aqui."
          />
        );
      case "nao-confirmado":
        return (
          <EmptyScreen
            Icon={IconCalendar}
            headline="Ainda não tem reservas não confirmadas"
            description="Você não possui reservas não confirmadas. Assim que alguém reservar uma hora, ela aparecerá aqui."
          />
        );
      case "anteriores":
        return (
          <EmptyScreen
            Icon={IconCalendar}
            headline="Ainda não tem reservas anteriores"
            description="Você não possui reservas anteriores. Assim que alguém reservar uma hora, ela aparecerá aqui."
          />
        );
      case "cancelado":
        return (
          <EmptyScreen
            Icon={IconCalendar}
            headline="Ainda não tem reservas canceladas"
            description="Você não possui reservas canceladas. Assim que alguém cancelar uma hora, ela aparecerá aqui."
          />
        );
      default:
        return (
          <EmptyScreen
            Icon={IconCalendar}
            headline="Ainda não tem reservas próximos"
            description="Você não possui reservas próximos. Assim que alguém reservar uma hora, ela aparecerá aqui."
          />
        );
    }
  };

  return (
    <>
      <PageHeader
        title="Reservas"
        subtitle="Veja os eventos futuros e passados reservados através dos links de tipos de eventos."
      />
      <div className="space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border">
              <Link
                href="/admin/agenda/proximos"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  tab === "proximos"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                Próximos
              </Link>
              <Link
                href="/admin/agenda/nao-confirmado"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  tab === "nao-confirmado"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                Não confirmado
              </Link>
              <Link
                href="/admin/agenda/anteriores"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  tab === "anteriores"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                Anteriores
              </Link>
              <Link
                href="/admin/agenda/cancelado"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  tab === "cancelado"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                Cancelados
              </Link>
            </div>
            <Button variant="outline">
              <IconFilter className="mr-2 size-4" />
              Filtrar
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled>
              <IconDeviceFloppy className="mr-2 size-4" />
              Salvar
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Segmento
                  <IconChevronDown className="ml-2 size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Segmento 1</DropdownMenuItem>
                <DropdownMenuItem>Segmento 2</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {renderContent()}
      </div>
    </>
  );
};

export default AgendamentosPage;
