"use client";

import { useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { useParams } from "next/navigation";
import dayjs from "@/lib/dayjs";

import {
  useScheduleForm,
  type ScheduleFormValues,
} from "./_hooks/use-schedule-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScheduleComponent } from "./_components/availability-schedule";
import {
  useCreateScheduleMutation,
  useScheduleQuery,
  useUpdateScheduleMutation,
} from "./_hooks/schedule-queries";

export function SchedulePageClient() {
  const params = useParams();
  const scheduleId = params.id as string;
  const isNew = scheduleId === "novo";

  const form = useScheduleForm();

  const { data: scheduleData, isLoading: isLoadingSchedule } =
    useScheduleQuery(scheduleId);
  const { mutate: createSchedule, isPending: isCreating } =
    useCreateScheduleMutation();
  const { mutate: updateSchedule, isPending: isUpdating } =
    useUpdateScheduleMutation(scheduleId);

  const isSubmitting = isCreating || isUpdating;

  console.log(scheduleData);

  useEffect(() => {
    if (scheduleData) {
      const availability = scheduleData.availability.reduce(
        (
          acc: { [key: number]: { start: Date; end: Date }[] },
          curr: { weekDay: number; startTime: number; endTime: number },
        ) => {
          const day = curr.weekDay;
          if (!acc[day]) {
            acc[day] = [];
          }
          const start = dayjs()
            .startOf("day")
            .add(curr.startTime, "minute")
            .toDate();
          const end = dayjs()
            .startOf("day")
            .add(curr.endTime, "minute")
            .toDate();
          acc[day].push({ start, end });
          return acc;
        },
        [] as { start: Date; end: Date }[][],
      );

      form.reset({ name: scheduleData.name, availability });
    }
  }, [scheduleData, form]);

  const onSubmit = async (values: ScheduleFormValues) => {
    if (isNew) {
      createSchedule(values);
    } else {
      updateSchedule(values);
    }
  };

  if (isLoadingSchedule) {
    return <div>Carregando...</div>;
  }

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Horário</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Horário Padrão" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ScheduleComponent
            control={form.control}
            userTimeFormat="24h"
            name={["availability"]}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isNew ? "Criar Horário" : "Salvar Alterações"}
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
