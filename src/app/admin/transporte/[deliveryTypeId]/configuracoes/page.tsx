"use client";
import { useParams } from "next/navigation";
import DeleteForm from "./_component/delete-form";
import DurationForm from "./_component/duration-form";
import LunchForm from "./_component/lunch-form";
import { useDeliveryTypeMutations } from "./_hooks/use-delivery-type-mutations";

export default function ConfiguracoesPage() {
  const params = useParams();
  const { updateDuration, updateLunchTime, deleteDeliveryType } =
    useDeliveryTypeMutations();

  const handleUpdateDuration = async (data: { [key: string]: string }) => {
    await updateDuration.mutateAsync({
      deliveryTypeId: params.deliveryTypeId as string,
      duration: Number.parseInt(data.time, 10),
    });
  };

  const handleUpdateLunchTime = async (data: {
    startTime: string;
    endTime: string;
  }) => {
    await updateLunchTime.mutateAsync({
      deliveryTypeId: params.deliveryTypeId as string,
      startTime: data.startTime,
      endTime: data.endTime,
    });
  };

  const handleDeleteDeliveryType = async () => {
    await deleteDeliveryType.mutateAsync({
      deliveryTypeId: params.deliveryTypeId as string,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <DurationForm
        title="Duração da entrega"
        description="Defina a duração da entrega para o tipo de transporte."
        helpText="Esse valor impacta na duração do agendamento."
        onSubmit={handleUpdateDuration}
      />
      <LunchForm
        title="Horário de almoço"
        description="Defina o horário de almoço o qual não será considerado para o agendamento."
        helpText="OBS: Esse horário vai sair do horário de agendamento."
        onSubmit={handleUpdateLunchTime}
      />
      <DeleteForm
        deliveryTypeName="Transporte"
        deliveryTypeStatus="Ativo"
        lastUpdated="2025-01-01"
        title="Deletar tipo de transporte"
        description="Deletar o tipo de transporte irá deletar todas as configurações relacionadas a ele."
        helpText="OBS: Essa ação é irreversível."
        onSubmit={handleDeleteDeliveryType}
      />
    </div>
  );
}
