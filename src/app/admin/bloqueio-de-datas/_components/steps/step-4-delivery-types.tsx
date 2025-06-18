"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import type { DeliveryType } from "@prisma/client";
import { useEffect, useState } from "react";

interface Step4DeliveryTypesProps {
  selectedDeliveryTypeIds: string[];
  onDeliveryTypeIdsChange: (ids: string[]) => void;
}

export function Step4DeliveryTypes({
  selectedDeliveryTypeIds,
  onDeliveryTypeIdsChange,
}: Step4DeliveryTypesProps) {
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
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div className="flex items-center space-x-2" key={i}>
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-48" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Selecionar Tipos de Entrega</h3>
      <p className="text-sm text-muted-foreground">
        Selecione quais tipos de entrega serão afetados por esta regra. Se
        nenhum for selecionado, a regra será aplicada a todos.
      </p>
      <div className="space-y-2">
        {deliveryTypes.map((deliveryType) => (
          <div key={deliveryType.id} className="flex items-center space-x-2">
            <Checkbox
              id={deliveryType.id}
              checked={selectedDeliveryTypeIds.includes(deliveryType.id)}
              onCheckedChange={() => handleCheckboxChange(deliveryType.id)}
            />
            <Label htmlFor={deliveryType.id} className="font-normal">
              {deliveryType.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
