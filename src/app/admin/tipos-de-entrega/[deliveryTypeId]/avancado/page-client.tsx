"use client";
import { useParams } from "next/navigation";
import { useDeliveryTypeConfig } from "../(main)/_hooks/use-delivery-type-config";
import { useDeliveryTypeMutations } from "./_hooks/use-delivery-type-mutations";
import DeleteForm from "./_components/delete-form";

export default function AvancadoPageClient() {
  const params = useParams();
  const deliveryTypeId = params.deliveryTypeId as string;
  const { data: config, isLoading } = useDeliveryTypeConfig(deliveryTypeId);
  const { deleteDeliveryType } = useDeliveryTypeMutations();

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
          <p className="mt-4 text-gray-600">Carregando configuração...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="text-center text-gray-600">
        Configuração não encontrada
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
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
