"use client";
import { use } from "react";
import {
  useDeliveryType,
  useUpdateDeliveryType,
} from "../(main)/_hooks/use-delivery-type";
import FutureBookingLimitForm from "./_components/future-booking-limit-form";
import MaxBookingsPerDayForm from "./_components/max-bookings-per-day-form";
import SkeletonForm from "./_components/skelleton";
import MinAntecedenceForm from "./_components/min-antecedence-form";

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

  if (isLoading) {
    return <SkeletonForm />;
  }

  return (
    <div className="space-y-4">
      <MinAntecedenceForm
        title="Dias mínimos de antecedência"
        description="Defina o número mínimo de dias de antecedência para agendamentos."
        helpText="O agendamento só será permitido com pelo menos este número de dias de antecedência, considerando apenas dias disponíveis."
        initialValues={{
          minAntecedence: deliveryType?.minAntecedence,
        }}
        onSubmit={updateFutureBookingLimit as any}
        isSubmitting={isUpdatingFutureBookingLimit}
        isLoading={isLoading}
        deliveryTypeId={deliveryTypeId}
      />
      <FutureBookingLimitForm
        title="Limitar reservas futuras"
        description="Ative para limitar o quão no futuro os agendamentos podem ser feitos."
        helpText="Isso previne agendamentos com muita antecedência."
        initialValues={{
          limitFutureBookings: deliveryType?.limitFutureBookings,
          futureBookingLimitDays: deliveryType?.futureBookingLimitDays,
        }}
        onSubmit={updateFutureBookingLimit}
        isSubmitting={isUpdatingFutureBookingLimit}
        isLoading={isLoading}
        deliveryTypeId={deliveryTypeId}
      />
      <MaxBookingsPerDayForm
        title="Limitar agendamentos por dia"
        description="Ative para limitar o número de agendamentos que podem ser feitos em um único dia."
        helpText="Isso previne a sobrecarga de agendamentos em dias específicos."
        initialValues={{
          limitPerDay: deliveryType?.limitPerDay,
          maxBookingsPerDay: deliveryType?.maxBookingsPerDay,
        }}
        onSubmit={updateFutureBookingLimit as any}
        isSubmitting={isUpdatingFutureBookingLimit}
        isLoading={isLoading}
        deliveryTypeId={deliveryTypeId}
      />
    </div>
  );
}
