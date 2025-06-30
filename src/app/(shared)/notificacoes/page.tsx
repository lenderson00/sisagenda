import { Inbox } from "@/components/inbox";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

export default function NotificationsPage() {
  return (
    <Container className="py-8">
      <div className="space-y-6">
        <div>
          <Heading size="lg" className="mb-2">
            Central de Notificações
          </Heading>
          <p className="text-muted-foreground">
            Gerencie todas as suas notificações relacionadas a agendamentos
          </p>
        </div>

        <Inbox className="mx-auto max-w-4xl" />
      </div>
    </Container>
  );
}
