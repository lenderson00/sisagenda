import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const weekDays = getWeekDays();

const timeIntervalsFormSchema = z.object({
  duration: z.number().min(30).max(120),
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
          const startTime = Number.parseInt(interval.startTime);
          const endTime = Number.parseInt(interval.endTime);
          return endTime - 60 >= startTime;
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

export const Availability = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<TimeIntervalsFormInput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      duration: 60,
      intervals: [
        {
          weekDay: 0,
          enabled: false,
          startTime: "08:00",
          endTime: "18:00",
        },
        {
          weekDay: 1,
          enabled: true,
          startTime: "08:00",
          endTime: "18:00",
        },
        {
          weekDay: 2,
          enabled: true,
          startTime: "08:00",
          endTime: "18:00",
        },
        {
          weekDay: 3,
          enabled: true,
          startTime: "08:00",
          endTime: "18:00",
        },
        {
          weekDay: 4,
          enabled: true,
          startTime: "08:00",
          endTime: "18:00",
        },
        {
          weekDay: 5,
          enabled: true,
          startTime: "08:00",
          endTime: "18:00",
        },
        {
          weekDay: 6,
          enabled: false,
          startTime: "08:00",
          endTime: "18:00",
        },
      ],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "intervals",
  });

  const watchedIntervals = watch("intervals");

  const handleSetTimeIntervals = async (data: TimeIntervalsFormOutput) => {
    console.log("Form submitted with data:", data);
    try {
      // Transform the data to match the Prisma schema
      const availabilityData = data.intervals.map((interval) => {
        // Convert HH:mm to minutes
        const [startHours, startMinutes] = interval.startTime
          .split(":")
          .map(Number);
        const [endHours, endMinutes] = interval.endTime.split(":").map(Number);

        const startTimeInMinutes = startHours * 60 + startMinutes;
        const endTimeInMinutes = endHours * 60 + endMinutes;

        return {
          weekDay: interval.weekDay,
          duration: data.duration,
          startTime: [startTimeInMinutes],
          endTime: [endTimeInMinutes],
          isActive: true,
        };
      });

      console.log("Transformed availability data:", availabilityData);
      // TODO: Add your API call here to save the availability data
    } catch (error) {
      console.error("Error in handleSetTimeIntervals:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit((data) => {
        console.log("Form submission started");
        handleSetTimeIntervals(data);
      })}
    >
      <div className="mb-4">
        <label
          htmlFor="duration-input"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Duração (minutos)
        </label>
        <Input
          id="duration-input"
          type="number"
          min={30}
          max={120}
          step={30}
          className="w-50 mt-1"
          {...register("duration", { valueAsNumber: true })}
        />
        {errors.duration && (
          <p className="text-xs text-destructive mt-1">
            {errors.duration.message}
          </p>
        )}
      </div>

      <div className="mb-6 rounded-md border divide-y">
        {fields.map((field, index) => {
          const currentInterval = watchedIntervals?.[index];
          const isEnabled = currentInterval?.enabled ?? false;
          const itemErrors = errors.intervals?.[index];

          return (
            <div key={field.id} className="p-4 bg-white">
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
                <div className="flex items-center gap-2">
                  <Input
                    aria-label={`Horário inicial para ${weekDays[field.weekDay]}`}
                    type="time"
                    step={3600}
                    disabled={!isEnabled}
                    className={cn(!isEnabled && "opacity-60")}
                    {...register(`intervals.${index}.startTime`)}
                  />
                  <Input
                    aria-label={`Horário final para ${weekDays[field.weekDay]}`}
                    type="time"
                    step={3600}
                    disabled={!isEnabled}
                    className={cn(!isEnabled && "opacity-60")}
                    {...register(`intervals.${index}.endTime`)}
                  />
                </div>
              </div>
              {itemErrors && (
                <div className="mt-1 pl-[calc(1rem+0.75rem)]">
                  {itemErrors.startTime && (
                    <p className="text-xs text-destructive">
                      {itemErrors.startTime.message}
                    </p>
                  )}
                  {itemErrors.endTime && (
                    <p className="text-xs text-destructive">
                      {itemErrors.endTime.message}
                    </p>
                  )}
                  {itemErrors.root && (
                    <p className="text-xs text-destructive">
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
        <p className="text-sm font-medium text-destructive mb-4">
          {errors.intervals.message}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar horários"}
      </Button>
    </form>
  );
};

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
