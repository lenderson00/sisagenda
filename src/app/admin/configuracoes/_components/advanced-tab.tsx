"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Organization } from "@prisma/client";
import { AlertTriangle, PowerOff } from "lucide-react";
import { toast } from "sonner";
import { useUpdateOrganization } from "../_hooks/use-update-organization";

interface AdvancedTabProps {
  organization: Organization;
}

export function AdvancedTab({ organization }: AdvancedTabProps) {
  const updateOrganization = useUpdateOrganization();

  const handleDeactivateOrganization = () => {
    updateOrganization.mutate(
      {
        id: organization.id,
        isActive: false,
      },
      {
        onSuccess: () => {
          toast.success("Organização desativada com sucesso");
        },
        onError: () => {
          toast.error("Erro ao desativar organização");
        },
      },
    );
  };

  const handleActivateOrganization = () => {
    updateOrganization.mutate(
      {
        id: organization.id,
        isActive: true,
      },
      {
        onSuccess: () => {
          toast.success("Organização ativada com sucesso");
        },
        onError: () => {
          toast.error("Erro ao ativar organização");
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* Organization Status */}
      <div>
        <h3 className="text-lg font-medium mb-4">Status da Organização</h3>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Status Atual
              <Badge
                variant={organization.isActive ? "default" : "destructive"}
              >
                {organization.isActive ? "Ativa" : "Inativa"}
              </Badge>
            </CardTitle>
            <CardDescription>
              {organization.isActive
                ? "Sua organização está ativa e funcionando normalmente."
                : "Sua organização está desativada e não pode receber agendamentos."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Nome da Organização</p>
                  <p className="text-sm text-muted-foreground">
                    {organization.name}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Sigla</p>
                  <p className="text-sm text-muted-foreground">
                    {organization.sigla}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="font-medium mb-2">Descrição</p>
                <p className="text-sm text-muted-foreground">
                  {organization.description || "Nenhuma descrição fornecida"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Organization Actions */}
      <div>
        <h3 className="text-lg font-medium mb-4">Ações da Organização</h3>
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <PowerOff className="h-5 w-5" />
              Desativar Organização
            </CardTitle>
            <CardDescription>
              {organization.isActive
                ? "Desativar a organização irá impedir novos agendamentos e limitar o acesso ao sistema."
                : "Ativar a organização irá restaurar o acesso completo ao sistema."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {organization.isActive ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="flex items-center gap-2"
                    >
                      <PowerOff className="h-4 w-4" />
                      Desativar Organização
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Desativar Organização
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja desativar a organização "
                        {organization.name}"? Esta ação irá:
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Impedir novos agendamentos</li>
                          <li>Limitar o acesso ao sistema</li>
                          <li>Manter os dados existentes</li>
                        </ul>
                        Esta ação pode ser revertida posteriormente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeactivateOrganization}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Desativar Organização
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button
                  onClick={handleActivateOrganization}
                  className="flex items-center gap-2"
                  disabled={updateOrganization.isPending}
                >
                  <PowerOff className="h-4 w-4" />
                  {updateOrganization.isPending
                    ? "Ativando..."
                    : "Ativar Organização"}
                </Button>
              )}

              <div className="text-sm text-muted-foreground">
                {organization.isActive
                  ? "Clique no botão acima para desativar a organização"
                  : "Clique no botão acima para ativar a organização"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800">Atenção</h4>
            <p className="text-sm text-yellow-700 mt-1">
              As ações nesta seção podem afetar significativamente o
              funcionamento da sua organização. Certifique-se de entender as
              consequências antes de prosseguir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
