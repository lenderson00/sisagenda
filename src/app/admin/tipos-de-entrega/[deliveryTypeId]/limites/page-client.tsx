"use client";
import { useParams } from "next/navigation";
import DeleteForm from "./_component/delete-form";
import LunchForm from "./_component/lunch-form";
import { useDeliveryTypeConfig } from "./_hooks/use-delivery-type-config";
import { useDeliveryTypeMutations } from "./_hooks/use-delivery-type-mutations";

export default function ConfiguracoesPageClient() {
  const params = useParams();
  const deliveryTypeId = params.deliveryTypeId as string;
  const { data: config, isLoading } = useDeliveryTypeConfig(deliveryTypeId);
  const { updateLunchTime, deleteDeliveryType } = useDeliveryTypeMutations();

  const handleUpdateLunchTime = async (data: {
    startTime: string;
    endTime: string;
  }) => {
    await updateLunchTime.mutateAsync({
      deliveryTypeId,
      startTime: data.startTime,
      endTime: data.endTime,
    });
  };

  const handleDeleteDeliveryType = async () => {
    await deleteDeliveryType.mutateAsync({
      deliveryTypeId,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
          <p className="mt-4 text-gray-600">Loading configuration...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="text-center text-gray-600">Configuration not found</div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <LunchForm
        title="Horário de almoço"
        description="Defina o horário de almoço o qual não será considerado para o agendamento."
        helpText="OBS: Esse horário vai sair do horário de agendamento."
        onSubmit={handleUpdateLunchTime}
        initialStartTime={config.lunchStartTime}
        initialEndTime={config.lunchEndTime}
      />
      <DeleteForm
        deliveryTypeName={config.name}
        deliveryTypeStatus={config.isActive ? "Ativo" : "Inativo"}
        lastUpdated={new Date(config.updatedAt).toLocaleDateString()}
        title="Deletar tipo de transporte"
        description="Deletar o tipo de transporte irá deletar todas as configurações relacionadas a ele."
        helpText="OBS: Essa ação é irreversível."
        onSubmit={handleDeleteDeliveryType}
      />
    </div>
  );
}
