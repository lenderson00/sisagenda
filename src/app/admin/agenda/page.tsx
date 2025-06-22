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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "../_components/page-header";
import { EmptyScreen } from "./_components/empty-screen";

const AgendamentosPage = () => {
  return (
    <>
      <PageHeader
        title="Reservas"
        subtitle="Veja os eventos futuros e passados reservados através dos links de tipos de eventos."
      />
      <div className="space-y-4 p-4 pt-6">
        <Tabs defaultValue="proximos">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TabsList>
                <TabsTrigger value="proximos">Próximos</TabsTrigger>
                <TabsTrigger value="nao-confirmado">Não confirmado</TabsTrigger>
                <TabsTrigger value="anteriores">Anteriores</TabsTrigger>
                <TabsTrigger value="cancelado">Cancelados</TabsTrigger>
              </TabsList>
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
          <TabsContent value="proximos">
            <EmptyScreen
              Icon={IconCalendar}
              headline="Ainda não tem reservas próximos"
              description="Você não possui reservas próximos. Assim que alguém reservar uma hora, ela aparecerá aqui."
            />
          </TabsContent>
          <TabsContent value="nao-confirmado">
            <EmptyScreen
              Icon={IconCalendar}
              headline="Ainda não tem reservas não confirmadas"
              description="Você não possui reservas não confirmadas. Assim que alguém reservar uma hora, ela aparecerá aqui."
            />
          </TabsContent>

          <TabsContent value="anteriores">
            <EmptyScreen
              Icon={IconCalendar}
              headline="Ainda não tem reservas anteriores"
              description="Você não possui reservas anteriores. Assim que alguém reservar uma hora, ela aparecerá aqui."
            />
          </TabsContent>
          <TabsContent value="cancelado">
            <EmptyScreen
              Icon={IconCalendar}
              headline="Ainda não tem reservas canceladas"
              description="Você não possui reservas canceladas. Assim que alguém cancelar uma hora, ela aparecerá aqui."
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AgendamentosPage;
