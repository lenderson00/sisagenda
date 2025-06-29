"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconDatabase,
  IconSearch,
  IconTable,
  IconArrowRight,
  IconSettings,
} from "@tabler/icons-react";

export function ConsultaParametrizadaClient() {
  const router = useRouter();

  // Auto-redirect to builder page
  useEffect(() => {
    router.push("/comimsup-admin/consulta/construir");
  }, [router]);

  return (
    <>
      <PageHeader
        title="Consulta Parametrizada"
        subtitle="Construa consultas avançadas nos agendamentos das organizações sob sua responsabilidade"
      />

      <div className="grid gap-6 p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconSearch className="h-5 w-5" />
              Bem-vindo à Consulta Parametrizada
            </CardTitle>
            <CardDescription>
              Redirecionando para o construtor de consultas...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              <IconDatabase className="mx-auto h-12 w-12 mb-4 animate-spin" />
              <p>Carregando construtor de consultas...</p>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={() =>
                  router.push("/comimsup-admin/consulta/construir")
                }
                className="flex items-center gap-2"
              >
                <IconSettings className="h-4 w-4" />
                Ir para o Construtor
                <IconArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
