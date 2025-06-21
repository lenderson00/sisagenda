"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { DurationForm } from "./_components/duration-form";
import { NameDescriptionForm } from "./_components/name-description-form";
import {
  useDeliveryType,
  useUpdateDeliveryType,
} from "./_hooks/use-delivery-type";

type DeliveryTypePageClientProps = {
  deliveryTypeId: string;
};

const DeliveryTypePageClient = ({
  deliveryTypeId,
}: DeliveryTypePageClientProps) => {
  const { data: deliveryType, isLoading } = useDeliveryType(deliveryTypeId);
  const {
    mutate: updateNameDescription,
    isPending: isUpdatingNameDescription,
  } = useUpdateDeliveryType(deliveryTypeId);
  const { mutate: updateDuration, isPending: isUpdatingDuration } =
    useUpdateDeliveryType(deliveryTypeId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!deliveryType) {
    return <div>Tipo de entrega não encontrado.</div>;
  }

  return (
    <div className="space-y-6">
      <NameDescriptionForm
        initialValues={{
          name: deliveryType.name,
          description: deliveryType.description || "",
        }}
        onSubmit={updateNameDescription}
        isSubmitting={isUpdatingNameDescription}
      />
      <DurationForm
        initialValues={{ duration: deliveryType.duration }}
        onSubmit={updateDuration}
        isSubmitting={isUpdatingDuration}
      />
    </div>
  );
};

export default DeliveryTypePageClient;
