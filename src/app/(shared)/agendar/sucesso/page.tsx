import { CheckCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function SchedulingSuccessPage() {
  return (
    <div className="container mx-auto flex h-[calc(100vh-80px)] items-center justify-center text-center">
      <div>
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold">Agendamento Solicitado!</h1>
        <p className="mt-2 text-muted-foreground">
          Sua solicitação de agendamento foi enviada com sucesso. <br />
          Você pode acompanhar o status na sua página de agendamentos.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button asChild>
            <Link href="/">Ver meus agendamentos</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/agendar">Agendar outro horário</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
