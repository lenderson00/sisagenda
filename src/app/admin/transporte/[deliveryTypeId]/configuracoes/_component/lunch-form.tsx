"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconCalendar } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type FormType = "text" | "time";

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

const generateTimeOptions = () => {
  const options = [
    { value: "30", label: "30min" },
    { value: "45", label: "45min" },
    { value: "60", label: "1h" },
    { value: "90", label: "1h30" },
    { value: "120", label: "2h" },
    { value: "150", label: "2h30" },
    { value: "180", label: "3h" },
  ];
  return options;
};

type TeamNameFormProps = {
  title: string;
  description: string;
  helpText: string;
  onSubmit?: (data: { startTime: string; endTime: string }) => void;
  className?: string;
  initialStartTime?: string;
  initialEndTime?: string;
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
      startTime: initialStartTime || "12:00",
      endTime: initialEndTime || "13:00",
    },
  });

  const handleSubmit = async (data: { startTime: string; endTime: string }) => {
    try {
      await onSubmit?.(data);
      await queryClient.invalidateQueries({ queryKey: ["deliveryTypeConfig"] });
      toast.success("Lunch time updated successfully");
    } catch (error) {
      toast.error("Failed to update lunch time");
    }
  };

  return (
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
