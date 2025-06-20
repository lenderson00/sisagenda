"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  useAvailability,
  useUpdateAvailability,
} from "./_hooks/use-availability";

interface Availability {
  weekDay: number;
  startTime: number;
  endTime: number;
}

const weekDays = getWeekDays();

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: "Você precisa selecionar pelo menos um dia da semana",
    })
    .refine(
      (intervals) => {
        return intervals.every((interval) => {
          const [startHours, startMinutes] = interval.startTime
            .split(":")
            .map(Number);
          const [endHours, endMinutes] = interval.endTime
            .split(":")
            .map(Number);
          const startTimeInMinutes = startHours * 60 + startMinutes;
          const endTimeInMinutes = endHours * 60 + endMinutes;
          return endTimeInMinutes - startTimeInMinutes >= 60;
        });
      },
      {
        message:
          "O horário de término deve ser pelo menos 1h distante do início.",
      },
    ),
});

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>;
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>;

export function DeliveryTypePageClient() {
  const params = useParams();
  const deliveryTypeId = params.deliveryTypeId as string;

  const { data: availability, isLoading } = useAvailability(deliveryTypeId);
  const updateAvailability = useUpdateAvailability(deliveryTypeId);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<TimeIntervalsFormInput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: Array.from({ length: 7 }, (_, index) => ({
        weekDay: index,
        enabled: false,
        startTime: "09:00",
        endTime: "15:00",
      })),
    },
  });

  useEffect(() => {
    if (availability) {
      reset({
        intervals: Array.from({ length: 7 }, (_, index) => {
          const availabilityForDay = availability.find(
            (item: Availability) => item.weekDay === index,
          );

          return {
            weekDay: index,
            enabled: !!availabilityForDay,
            startTime: availabilityForDay
              ? formatTimeFromMinutes(availabilityForDay.startTime)
              : "09:00",
            endTime: availabilityForDay
              ? formatTimeFromMinutes(availabilityForDay.endTime)
              : "15:00",
          };
        }),
      });
    }
  }, [availability, reset]);

  const { fields } = useFieldArray({
    control,
    name: "intervals",
  });

  const watchedIntervals = watch("intervals");

  useEffect(() => {
    if (errors?.intervals?.root) {
      toast.error(errors.intervals.root.message);
    }
  }, [errors]);

  const onSubmit = async (data: TimeIntervalsFormOutput) => {
    try {
      const availabilityData = data.intervals.map((interval) => {
        const [startHours, startMinutes] = interval.startTime
          .split(":")
          .map(Number);
        const [endHours, endMinutes] = interval.endTime.split(":").map(Number);

        const startTimeInMinutes = startHours * 60 + startMinutes;
        const endTimeInMinutes = endHours * 60 + endMinutes;

        return {
          weekDay: interval.weekDay,
          startTime: startTimeInMinutes,
          endTime: endTimeInMinutes,
        };
      });

      await updateAvailability.mutateAsync(availabilityData);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        "Erro ao salvar os horários. Por favor, verifique os dados e tente novamente.",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
          <p className="mt-4 text-gray-600">Carregando disponibilidade...</p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) => {
        if (errors.intervals?.message) {
          toast.error(errors.intervals.message);
        }
      })}
      className="space-y-4"
    >
      <div className="mb-6 border border-neutral-200 rounded-md overflow-hidden divide-y">
        {fields.map((field, index) => {
          const currentInterval = watchedIntervals?.[index];
          const isEnabled = currentInterval?.enabled ?? false;
          const itemErrors = errors.intervals?.[index];
          const hasError = itemErrors?.startTime || itemErrors?.endTime;

          return (
            <div
              key={field.id}
              className={cn(
                "p-4 bg-white",
                hasError && "border-l-4 border-l-red-500",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Controller
                    name={`intervals.${index}.enabled`}
                    control={control}
                    render={({ field: controllerField }) => (
                      <Checkbox
                        id={`interval-enabled-${index}`}
                        checked={controllerField.value}
                        onCheckedChange={controllerField.onChange}
                        aria-labelledby={`weekday-label-${index}`}
                      />
                    )}
                  />
                  <label
                    htmlFor={`interval-enabled-${index}`}
                    id={`weekday-label-${index}`}
                    className="text-sm font-medium select-none cursor-pointer text-gray-800 dark:text-gray-200"
                  >
                    {weekDays[field.weekDay]}
                  </label>
                </div>
                <div className="flex items-center gap-2 w-fit">
                  <Input
                    aria-label={`Horário inicial para ${weekDays[field.weekDay]}`}
                    type="time"
                    step={3600}
                    disabled={!isEnabled}
                    className={cn(
                      !isEnabled && "opacity-60",
                      itemErrors?.startTime &&
                        "border-red-500 focus-visible:ring-red-500",
                    )}
                    {...register(`intervals.${index}.startTime`)}
                  />
                  <Input
                    aria-label={`Horário final para ${weekDays[field.weekDay]}`}
                    type="time"
                    step={3600}
                    disabled={!isEnabled}
                    className={cn(
                      !isEnabled && "opacity-60",
                      itemErrors?.endTime &&
                        "border-red-500 focus-visible:ring-red-500",
                    )}
                    {...register(`intervals.${index}.endTime`)}
                  />
                </div>
              </div>
              {itemErrors && (
                <div className="mt-1 pl-[calc(1rem+0.75rem)]">
                  {itemErrors.startTime && (
                    <p className="text-xs text-red-500">
                      {itemErrors.startTime.message}
                    </p>
                  )}
                  {itemErrors.endTime && (
                    <p className="text-xs text-red-500">
                      {itemErrors.endTime.message}
                    </p>
                  )}
                  {itemErrors.root && (
                    <p className="text-xs text-red-500">
                      {itemErrors.root.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {errors.intervals && typeof errors.intervals.message === "string" && (
        <p className="text-sm font-medium text-red-500 mb-4">
          {errors.intervals.message}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar horários"}
      </Button>
    </form>
  );
}

interface GetWeekDaysParams {
  short?: boolean;
}

export function getWeekDays({ short = false }: GetWeekDaysParams = {}) {
  const formatter = new Intl.DateTimeFormat("pt-BR", { weekday: "long" });

  return Array.from(Array(7).keys())
    .map((day) => formatter.format(new Date(Date.UTC(2021, 5, day))))
    .map((weekDay) => {
      if (short) {
        return weekDay.substring(0, 3).toUpperCase();
      }

      return weekDay.substring(0, 1).toUpperCase().concat(weekDay.substring(1));
    });
}

function formatTimeFromMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}
