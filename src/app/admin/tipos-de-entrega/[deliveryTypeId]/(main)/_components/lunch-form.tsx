"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const minutesToTime = (minutes: number | undefined | null) => {
  if (minutes === null || minutes === undefined) {
    return "";
  }
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const mins = (minutes % 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
};

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

type FormValues = {
  startTime: string;
  endTime: string;
};

const formSchema = z
  .object({
    startTime: z
      .string()
      .min(1, "Horário de início é obrigatório")
      .refine((time: string) => {
        const [hours, minutes] = time.split(":").map(Number);
        const timeInMinutes = hours * 60 + minutes;
        const minTime = 10 * 60 + 30; // 10:30
        const maxTime = 13 * 60; // 13:00
        return timeInMinutes >= minTime && timeInMinutes <= maxTime;
      }, "O horário de início deve estar entre 10:30 e 13:00"),
    endTime: z
      .string()
      .min(1, "Horário de término é obrigatório")
      .refine((time: string) => {
        const [hours, minutes] = time.split(":").map(Number);
        const timeInMinutes = hours * 60 + minutes;
        const minTime = 11 * 60 + 30; // 11:30
        const maxTime = 14 * 60; // 14:00
        return timeInMinutes >= minTime && timeInMinutes <= maxTime;
      }, "O horário de término deve estar entre 11:30 e 14:00"),
  })
  .refine(
    (data: FormValues) => {
      const [startHours, startMinutes] = data.startTime.split(":").map(Number);
      const [endHours, endMinutes] = data.endTime.split(":").map(Number);
      const startTimeInMinutes = startHours * 60 + startMinutes;
      const endTimeInMinutes = endHours * 60 + endMinutes;
      return endTimeInMinutes > startTimeInMinutes;
    },
    {
      message: "O horário de término deve ser posterior ao horário de início",
      path: ["endTime"],
    },
  );

type TeamNameFormProps = {
  title: string;
  description: string;
  helpText: string;
  onSubmit?: (data: { startTime: number; endTime: number }) => void;
  className?: string;
  initialStartTime?: number;
  initialEndTime?: number;
  isSubmitting?: boolean;
};

export default function LunchForm({
  title,
  description,
  helpText,
  onSubmit,
  className,
  initialStartTime,
  initialEndTime,
}: TeamNameFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startTime: minutesToTime(initialStartTime) || "12:00",
      endTime: minutesToTime(initialEndTime) || "13:00",
    },
  });

  const handleSubmit = async (data: FormValues) => {
    if (onSubmit) {
      onSubmit({
        startTime: timeToMinutes(data.startTime),
        endTime: timeToMinutes(data.endTime),
      });
    }
    await queryClient.invalidateQueries({ queryKey: ["deliveryTypeConfig"] });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className={className}>
      <Card className="w-full  pb-0 gap-0 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="space-y-2">
            <Label className="text-lg font-semibold text-foreground">
              {title}
            </Label>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">
              {description}
            </p>
          </div>
          <div className="relative flex items-center gap-6 justify-between">
            <div className="flex items-center gap-4 w-full">
              <div className="flex-1">
                <Label
                  htmlFor="startTime"
                  className="text-sm font-medium mb-2 block"
                >
                  Início do Almoço
                </Label>
                <Input
                  type="time"
                  id="startTime"
                  {...form.register("startTime")}
                  className={cn(
                    "w-full h-10",
                    form.formState.errors.startTime && "border-red-500",
                  )}
                />
                <div className="h-5">
                  {form.formState.errors.startTime && (
                    <p className="text-xs text-red-500 mt-1">
                      {form.formState.errors.startTime.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <Label
                  htmlFor="endTime"
                  className="text-sm font-medium mb-2 block"
                >
                  Final do Almoço
                </Label>
                <Input
                  type="time"
                  id="endTime"
                  {...form.register("endTime")}
                  className={cn(
                    "w-full h-10",
                    form.formState.errors.endTime && "border-red-500",
                  )}
                />
                <div className="h-5">
                  {form.formState.errors.endTime && (
                    <p className="text-xs text-red-500 mt-1">
                      {form.formState.errors.endTime.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex justify-between items-center bg-neutral-100 h-14 mt-2 border-t">
          <p className="text-xs text-muted-foreground">{helpText}</p>
          <div className="flex justify-end">
            <FormButton isSubmitting={form.formState.isSubmitting} />
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

type FormButtonProps = {
  isSubmitting: boolean;
};

function FormButton({ isSubmitting }: FormButtonProps) {
  return (
    <button
      type="submit"
      className={cn(
        "flex !h-8 md:w-fit px-4 text-xs items-center justify-center space-x-2 rounded-md w-full border  transition-all focus:outline-none sm:h-10",
        isSubmitting
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400  "
          : "border-black bg-black text-white  hover:opacity-80 cursor-pointer  ",
      )}
      disabled={isSubmitting}
    >
      {isSubmitting ? <LoadingDots color="#808080" /> : <p>Salvar</p>}
    </button>
  );
}
