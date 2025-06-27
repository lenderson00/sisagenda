import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconCalendar, IconClock, IconCheck, IconX } from "@tabler/icons-react";

export default function UserDashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral dos seus agendamentos e atividades"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Meus Agendamentos
            </CardTitle>
            <IconCalendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Total de agendamentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Agendamentos Pendentes
            </CardTitle>
            <IconClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Aguardando confirmação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Agendamentos Confirmados
            </CardTitle>
            <IconCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Confirmados e ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Agendamentos Cancelados
            </CardTitle>
            <IconX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Cancelados este mês</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 p-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Próximos Agendamentos</CardTitle>
            <CardDescription>
              Seus próximos compromissos agendados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium">Consulta Médica</p>
                  <p className="text-xs text-muted-foreground">
                    Dr. Silva - Cardiologia
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">15/12/2024</p>
                  <p className="text-xs text-muted-foreground">14:30</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium">Exame de Sangue</p>
                  <p className="text-xs text-muted-foreground">
                    Laboratório Central
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">18/12/2024</p>
                  <p className="text-xs text-muted-foreground">08:00</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium">Fisioterapia</p>
                  <p className="text-xs text-muted-foreground">Fisio Center</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">20/12/2024</p>
                  <p className="text-xs text-muted-foreground">16:00</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Suas últimas atividades no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Agendamento confirmado</p>
                  <p className="text-xs text-muted-foreground">
                    Consulta Médica - Há 2 horas
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Novo agendamento criado</p>
                  <p className="text-xs text-muted-foreground">
                    Fisioterapia - Ontem
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Agendamento cancelado</p>
                  <p className="text-xs text-muted-foreground">
                    Exame de Urina - 2 dias atrás
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
