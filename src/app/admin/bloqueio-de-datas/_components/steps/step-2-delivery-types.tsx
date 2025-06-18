"use client";

import { Skeleton } from "@/components/ui/skeleton";
import type { DeliveryType } from "@prisma/client";
import { useEffect, useState } from "react";
import { DeliveryTypeCard } from "../delivery-type-card";

interface Step2DeliveryTypesProps {
  selectedDeliveryTypeIds: string[];
  onDeliveryTypeIdsChange: (ids: string[]) => void;
}

export function Step2DeliveryTypes({
  selectedDeliveryTypeIds,
  onDeliveryTypeIdsChange,
}: Step2DeliveryTypesProps) {
  const [deliveryTypes, setDeliveryTypes] = useState<DeliveryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDeliveryTypes() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/delivery-types");
        if (response.ok) {
          const data = await response.json();
          setDeliveryTypes(data);
        }
      } catch (error) {
        console.error("Failed to fetch delivery types", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDeliveryTypes();
  }, []);

  const handleCheckboxChange = (deliveryTypeId: string) => {
    const newSelectedIds = selectedDeliveryTypeIds.includes(deliveryTypeId)
      ? selectedDeliveryTypeIds.filter((id) => id !== deliveryTypeId)
      : [...selectedDeliveryTypeIds, deliveryTypeId];
    onDeliveryTypeIdsChange(newSelectedIds);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton className="h-32 w-full" key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Selecionar Tipos de Entrega</h3>
        <p className="text-sm text-muted-foreground">
          Selecione quais tipos de entrega serão afetados por esta regra. Se
          nenhum for selecionado, a regra será aplicada a todos.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {deliveryTypes.map((deliveryType) => (
          <DeliveryTypeCard
            key={deliveryType.id}
            deliveryType={deliveryType}
            isSelected={selectedDeliveryTypeIds.includes(deliveryType.id)}
            onSelect={handleCheckboxChange}
          />
        ))}
      </div>
    </div>
  );
}
