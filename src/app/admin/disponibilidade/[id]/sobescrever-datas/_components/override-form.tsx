"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useEffect, useState, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import type { DateOverride } from "../page-client";
import { useQuery } from "@tanstack/react-query";
import type { Schedule, Availability } from "@prisma/client";

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes: number) => {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

const overrideItemSchema = z
  .object({
    id: z.string(),
    date: z.string(),
    isAllDay: z.boolean(),
    startTime: z.string(),
    endTime: z.string(),
    comment: z.string().min(1, "A justificativa é obrigatória."),
  })
  .refine(
    (data) => {
      if (data.isAllDay) return true;
      return timeToMinutes(data.startTime) < timeToMinutes(data.endTime);
    },
    {
      message: "O horário de término deve ser após o horário de início.",
      path: ["endTime"],
    },
  );

const formSchema = z.object({
  overrides: z
    .array(overrideItemSchema)
    .min(1, "Selecione pelo menos uma data."),
});

export type OverrideFormValues = {
  date: string;
  isAllDay: boolean;
  startTime: number;
  endTime: number;
  comment: string;
};

interface OverrideFormProps {
  onSave: (values: OverrideFormValues[]) => void;
  initialData?: DateOverride | null;
  existingOverrides: DateOverride[];
  scheduleId: string;
}

export function OverrideForm({
  onSave,
  initialData,
  existingOverrides,
  scheduleId,
}: OverrideFormProps) {
  const isEditMode = !!initialData;
  const [activeDate, setActiveDate] = useState<string | null>(null);

  const { data: schedule } = useQuery<
    Schedule & { availability: Availability[] }
  >({
    queryKey: ["schedule", scheduleId],
    queryFn: async () => {
      const response = await fetch(`/api/schedules/${scheduleId}`);
      if (!response.ok) throw new Error("Failed to fetch schedule");
      return response.json();
    },
    enabled: !!scheduleId,
  });

  const availableWeekDays = useMemo(() => {
    return schedule?.availability.map((a) => a.weekDay) ?? [];
  }, [schedule]);

  const existingOverrideDates = useMemo(() => {
    return existingOverrides.map((o) =>
      o.date ? dayjs(o.date).format("YYYY-MM-DD") : "",
    );
  }, [existingOverrides]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      overrides: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "overrides",
    keyName: "fieldId",
  });

  useEffect(() => {
    if (initialData && fields.length === 0) {
      append({
        id: initialData.id,
        date: initialData.date
          ? dayjs(initialData.date).format("YYYY-MM-DD")
          : "",
        isAllDay: initialData.isAllDay,
        startTime: minutesToTime(initialData.startTime ?? 0),
        endTime: minutesToTime(initialData.endTime ?? 0),
        comment: initialData.comment ?? "",
      });
      setActiveDate(
        initialData.date ? dayjs(initialData.date).format("YYYY-MM-DD") : null,
      );
    }
  }, [initialData, append, fields.length]);

  const handleDateSelect = (dates: Date[] | undefined) => {
    const currentDates = fields.map((f) => f.date);
    const newDates = dates?.map((d) => dayjs(d).format("YYYY-MM-DD")) || [];

    newDates.forEach((dateStr) => {
      if (!currentDates.includes(dateStr)) {
        append({
          id: crypto.randomUUID(),
          date: dateStr,
          isAllDay: false,
          startTime: "09:00",
          endTime: "17:00",
          comment: "",
        });
      }
    });

    const removedDates = fields
      .filter((field) => !newDates.includes(field.date))
      .map((f) => f.date);
    if (removedDates.length > 0) {
      const indicesToRemove = fields
        .map((field, index) => (removedDates.includes(field.date) ? index : -1))
        .filter((index) => index !== -1)
        .reverse();
      indicesToRemove.forEach((index) => remove(index));
    }

    if (activeDate && removedDates.includes(activeDate)) {
      setActiveDate(newDates[0] || null);
    } else if (!activeDate && newDates.length > 0) {
      setActiveDate(newDates[0]);
    }
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const formattedValues = data.overrides.map((ov) => ({
      date: ov.date,
      isAllDay: ov.isAllDay,
      startTime: timeToMinutes(ov.startTime),
      endTime: ov.isAllDay ? 1439 : timeToMinutes(ov.endTime),
      comment: ov.comment,
    }));
    onSave(formattedValues);
  };

  const selectedDatesForCalendar = fields.map((f) => dayjs(f.date).toDate());
  const activeIndex = fields.findIndex((field) => field.date === activeDate);

  const isDateDisabled = (date: Date) => {
    const dayOfWeek = dayjs(date).day();
    const dateStr = dayjs(date).format("YYYY-MM-DD");

    if (isEditMode) {
      return dateStr !== initialData?.date?.toString().split("T")[0];
    }

    if (existingOverrideDates.includes(dateStr)) {
      return true;
    }

    return !availableWeekDays.includes(dayOfWeek);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <FormLabel>Selecione as datas para substituir</FormLabel>
          <Calendar
            mode="multiple"
            selected={selectedDatesForCalendar}
            onSelect={isEditMode ? undefined : handleDateSelect}
            className="mt-2 rounded-md border"
            disabled={isDateDisabled}
          />
          <FormMessage>{form.formState.errors.overrides?.message}</FormMessage>
        </div>

        {fields.length > 0 && (
          <div className="flex flex-wrap gap-2 border-b pb-4">
            {fields.map((field) => (
              <Button
                key={field.id}
                type="button"
                variant={field.date === activeDate ? "secondary" : "outline"}
                size="sm"
                onClick={() => setActiveDate(field.date)}
              >
                {dayjs(field.date).format("DD/MM/YY")}
              </Button>
            ))}
          </div>
        )}

        {activeIndex !== -1 && (
          <div className="max-h-[40vh] space-y-4 overflow-y-auto pr-2">
            <Card
              key={fields[activeIndex].fieldId}
              className="border-none shadow-none"
            >
              <CardHeader className="p-0">
                <CardTitle className="capitalize">
                  {dayjs(fields[activeIndex].date).format("dddd, D [de] MMMM")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-0 pt-4">
                <div>
                  <FormLabel>Que horas você está livre?</FormLabel>
                  <div className="mt-2 flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`overrides.${activeIndex}.startTime`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="time"
                              {...field}
                              disabled={form.watch(
                                `overrides.${activeIndex}.isAllDay`,
                              )}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <span>-</span>
                    <FormField
                      control={form.control}
                      name={`overrides.${activeIndex}.endTime`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="time"
                              {...field}
                              disabled={form.watch(
                                `overrides.${activeIndex}.isAllDay`,
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name={`overrides.${activeIndex}.isAllDay`}
                  render={({ field: switchField }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <FormLabel>Marcar indisponível (o dia todo)</FormLabel>
                      <FormControl>
                        <Switch
                          checked={switchField.value}
                          onCheckedChange={switchField.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`overrides.${activeIndex}.comment`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Justificativa</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={fields.length === 0}>
            Salvar Substituições
          </Button>
        </div>
      </form>
    </Form>
  );
}
