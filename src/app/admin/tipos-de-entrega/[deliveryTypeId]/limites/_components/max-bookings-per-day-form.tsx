"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useLimitBookingsPerDay } from "../_hooks/use-limit-bookings-per-day";
import { AnimatePresence, motion } from "framer-motion";

type FormValues = {
  limitPerDay: boolean;
  maxBookingsPerDay: number;
};

const formSchema = z.object({
  limitPerDay: z.boolean(),
  maxBookingsPerDay: z
    .number()
    .min(1, "O número de agendamentos deve ser maior que 0")
    .max(100, "O número de agendamentos deve ser menor que 100"),
});

type MaxBookingsPerDayFormProps = {
  title: string;
  description: string;
  helpText: string;
  onSubmit?: (data: FormValues) => void;
  className?: string;
  initialValues?: Partial<FormValues>;
  isSubmitting?: boolean;
  isLoading?: boolean;
  deliveryTypeId: string;
};

export default function MaxBookingsPerDayForm({
  title,
  description,
  helpText,
  onSubmit,
  className,
  initialValues,
  isSubmitting,
  isLoading,
  deliveryTypeId,
}: MaxBookingsPerDayFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      limitPerDay: initialValues?.limitPerDay || false,
      maxBookingsPerDay: initialValues?.maxBookingsPerDay || 10,
    },
  });

  const { mutate: updateLimitPerDay } = useLimitBookingsPerDay(deliveryTypeId);

  const limitPerDay = form.watch("limitPerDay");

  const handleSubmit = async (data: FormValues) => {
    onSubmit?.(data);
    await queryClient.invalidateQueries({
      queryKey: ["deliveryType", deliveryTypeId],
    });
  };

  const handleUpdateLimitPerDay = (data: { limitPerDay: boolean }) => {
    updateLimitPerDay(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["deliveryType", deliveryTypeId],
        });
      },
    });
  };

  return (
    <AnimatePresence mode="wait">
      <form onSubmit={form.handleSubmit(handleSubmit)} className={className}>
        <Card className="w-full pb-0 gap-0 overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Label className="text-lg font-semibold text-foreground">
                  {title}
                </Label>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                  {description}
                </p>
              </div>
              <Controller
                name="limitPerDay"
                control={form.control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={(e) => {
                      field.onChange(e);
                      handleUpdateLimitPerDay({
                        limitPerDay: e,
                      });
                    }}
                  />
                )}
              />
            </div>
          </CardHeader>
          <motion.div layout animate={{ height: limitPerDay ? "auto" : 0 }}>
            <div className="p-6 pt-0">
              <div
                className={cn(
                  "relative flex items-center gap-6 justify-between transition-opacity",
                  !limitPerDay && "opacity-50 pointer-events-none",
                )}
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="flex-1">
                    <div className="relative">
                      <Input
                        type="number"
                        id="maxBookingsPerDay"
                        {...form.register("maxBookingsPerDay", {
                          valueAsNumber: true,
                        })}
                        disabled={!limitPerDay}
                        className={cn(
                          "w-full h-10 pr-[160px]",
                          form.formState.errors.maxBookingsPerDay &&
                            "border-red-500",
                        )}
                      />
                      <Label
                        htmlFor="maxBookingsPerDay"
                        className="absolute top-1/2 -translate-y-1/2 right-2 text-gray-500"
                      >
                        agendamentos por dia
                      </Label>
                    </div>
                    <div className="h-5">
                      {form.formState.errors.maxBookingsPerDay && (
                        <p className="text-xs text-red-500 mt-1">
                          {form.formState.errors.maxBookingsPerDay.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="flex justify-between items-center bg-neutral-100 h-14 mt-2 border-t">
              <p className="text-xs text-muted-foreground">{helpText}</p>
              <div className="flex justify-end">
                <FormButton isSubmitting={form.formState.isSubmitting} />
              </div>
            </CardContent>
          </motion.div>
        </Card>
      </form>
    </AnimatePresence>
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
