"use client";

import type { Organization } from "@prisma/client";
import ComimsupForm from "./comimsup-form";
import LunchForm from "./lunch-form";
import OrganizationInfoForm from "./organization-info-form";

interface GeneralTabProps {
  organization: Organization;
}

export function GeneralTab({ organization }: GeneralTabProps) {
  return (
    <div className="space-y-6">
      <OrganizationInfoForm
        title="Informações da Organização"
        description="Edite o nome, sigla e descrição da sua organização."
        helpText="Estas informações são exibidas para os usuários que fazem agendamentos."
        organization={organization}
        initialValues={{
          name: organization.name,
          sigla: organization.sigla,
          description: organization.description || "",
        }}
      />

      <ComimsupForm
        title="COMIMSUP"
        description="Selecione o COMIMSUP responsável pela sua organização, se aplicável."
        helpText="O COMIMSUP é responsável por gerenciar e supervisionar as atividades da organização."
        organization={organization}
        initialValues={{
          comimsupId: organization.comimsupId || "none",
        }}
      />

      <LunchForm
        title="Horário de Almoço"
        description="Defina o horário de almoço da sua organização. Nenhum agendamento poderá ser feito neste intervalo."
        helpText="Este horário de almoço será aplicado para todos os tipos de entrega."
        organization={organization}
      />
    </div>
  );
}
