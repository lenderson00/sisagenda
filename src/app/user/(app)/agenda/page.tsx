import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  IconCalendar,
  IconClock,
  IconMapPin,
  IconBuilding,
} from "@tabler/icons-react";

export default function UserAgendaPage() {
  return (
    <>
      <PageHeader
        title="Meus Agendamentos"
        subtitle="Visualize seus agendamentos e compromissos agendados"
      />

      <div className="p-4 space-y-6">
        {/* Filter Tabs */}
        <div className="flex gap-2">
          <Button variant="default" size="sm">
            Próximos
          </Button>
          <Button variant="outline" size="sm">
            Pendentes
          </Button>
          <Button variant="outline" size="sm">
            Cancelados
          </Button>
          <Button variant="outline" size="sm">
            Concluídos
          </Button>
        </div>

        {/* Appointments List */}
        <div className="grid gap-4">
          {/* Confirmed Appointment */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">
                      Entrega de Material - COMIMSUP
                    </h3>
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800"
                    >
                      Confirmado
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <IconCalendar className="h-4 w-4" />
                      <span>15 de Dezembro, 2024</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconClock className="h-4 w-4" />
                      <span>14:30 - 15:30</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconMapPin className="h-4 w-4" />
                      <span>Almoxarifado Central - Bloco A</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconBuilding className="h-4 w-4" />
                      <span>COMIMSUP - Organização Militar</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Appointment */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">
                      Entrega de Equipamentos - Base Naval
                    </h3>
                    <Badge variant="secondary">Pendente</Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <IconCalendar className="h-4 w-4" />
                      <span>18 de Dezembro, 2024</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconClock className="h-4 w-4" />
                      <span>08:00 - 09:00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconMapPin className="h-4 w-4" />
                      <span>Portão Principal - Base Naval</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconBuilding className="h-4 w-4" />
                      <span>Base Naval - Organização Militar</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Confirmed Appointment */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">
                      Entrega de Suprimentos - Hospital Naval
                    </h3>
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800"
                    >
                      Confirmado
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <IconCalendar className="h-4 w-4" />
                      <span>20 de Dezembro, 2024</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconClock className="h-4 w-4" />
                      <span>16:00 - 17:00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconMapPin className="h-4 w-4" />
                      <span>Recebimento - Hospital Naval</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconBuilding className="h-4 w-4" />
                      <span>Hospital Naval - Organização Militar</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Completed Appointment */}
          <Card className="opacity-75">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">
                      Entrega de Material - Academia Naval
                    </h3>
                    <Badge variant="outline">Concluído</Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <IconCalendar className="h-4 w-4" />
                      <span>10 de Dezembro, 2024</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconClock className="h-4 w-4" />
                      <span>10:00 - 11:00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconMapPin className="h-4 w-4" />
                      <span>Almoxarifado - Academia Naval</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconBuilding className="h-4 w-4" />
                      <span>Academia Naval - Organização Militar</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
