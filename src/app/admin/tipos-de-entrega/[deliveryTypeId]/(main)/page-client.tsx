"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { DurationForm } from "./_components/duration-form";
import { NameDescriptionForm } from "./_components/name-description-form";
import {
  useDeliveryType,
  useUpdateDeliveryType,
} from "./_hooks/use-delivery-type";
import LunchForm from "./_components/lunch-form";
import { notFound } from "next/navigation";
import { useUpdateLunchTime } from "./_hooks/use-update-lunch-time";

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
  const { mutate: updateLunchTime, isPending: isUpdatingLunchTime } =
    useUpdateLunchTime();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!deliveryType) {
    notFound();
  }

  console.log(deliveryType);

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
      <LunchForm
        initialStartTime={deliveryType.lunchTimeStart}
        initialEndTime={deliveryType.lunchTimeEnd}
        title="Almoço"
        description="Defina o horário de almoço para o tipo de entrega."
        helpText="Esse horário será usado para calcular o tempo de entrega."
        onSubmit={(data) =>
          updateLunchTime({
            deliveryTypeId,
            startTime: data.startTime,
            endTime: data.endTime,
          })
        }
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
