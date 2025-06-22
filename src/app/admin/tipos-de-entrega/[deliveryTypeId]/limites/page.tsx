"use client";
import { use } from "react";
import {
  useDeliveryType,
  useUpdateDeliveryType,
} from "../(main)/_hooks/use-delivery-type";
import FutureBookingLimitForm from "./_components/future-booking-limit-form";

export default function Page({
  params,
}: {
  params: Promise<{ deliveryTypeId: string }>;
}) {
  const { deliveryTypeId } = use(params);
  const { data: deliveryType, isLoading } = useDeliveryType(deliveryTypeId);

  const {
    mutate: updateFutureBookingLimit,
    isPending: isUpdatingFutureBookingLimit,
  } = useUpdateDeliveryType(deliveryTypeId);

  return (
    <>
      <FutureBookingLimitForm
        title="Limitar reservas futuras"
        description="Ative para limitar o quão no futuro os agendamentos podem ser feitos."
        helpText="Isso previne agendamentos com muita antecedência."
        initialValues={
          deliveryType
            ? {
                limitFutureBookings: deliveryType.limitFutureBookings,
                futureBookingLimitDays: deliveryType.futureBookingLimitDays,
              }
            : undefined
        }
        onSubmit={updateFutureBookingLimit}
        isSubmitting={isUpdatingFutureBookingLimit}
        isLoading={isLoading}
        deliveryTypeId={deliveryTypeId}
      />
    </>
  );
}
