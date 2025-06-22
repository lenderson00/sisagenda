"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const ScheduleFormSchema = z.object({
  name: z.string().min(1, "O nome do horário é obrigatório."),
  availability: z
    .array(
      z.array(
        z.object({
          start: z.date(),
          end: z.date(),
        }),
      ),
    )
    .optional(),
});

export type ScheduleFormValues = z.infer<typeof ScheduleFormSchema>;

export const useScheduleForm = (defaultValues?: Partial<ScheduleFormValues>) => {
  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(ScheduleFormSchema),
    defaultValues: defaultValues || {
      name: "",
      availability: [],
    },
  });

  return form;
};
