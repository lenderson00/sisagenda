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
import FutureBookingLimitFormSkeleton from "./future-booking-limit-form-skeleton";
import { useLimiteFutureBookings } from "../_hooks/use-limite-future-bookins";
import { AnimatePresence, motion } from "framer-motion";

type FormValues = {
  limitFutureBookings: boolean;
  futureBookingLimitDays: number;
};

const formSchema = z.object({
  limitFutureBookings: z.boolean(),
  futureBookingLimitDays: z
    .number()
    .min(1, "O número de dias deve ser maior que 0")
    .max(120, "O número de dias deve ser menor que 120"),
});

type FutureBookingLimitFormProps = {
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

export default function FutureBookingLimitForm({
  title,
  description,
  helpText,
  onSubmit,
  className,
  initialValues,
  isSubmitting,
  isLoading,
  deliveryTypeId,
}: FutureBookingLimitFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      limitFutureBookings: initialValues?.limitFutureBookings || false,
      futureBookingLimitDays: initialValues?.futureBookingLimitDays || 30,
    },
  });

  const { mutate: updateLimitFutureBookings } =
    useLimiteFutureBookings(deliveryTypeId);

  const limitFutureBookings = form.watch("limitFutureBookings");

  const handleSubmit = async (data: FormValues) => {
    onSubmit?.(data);
    await queryClient.invalidateQueries({
      queryKey: ["deliveryType", deliveryTypeId],
    });
  };

  if (isLoading) {
    return <FutureBookingLimitFormSkeleton />;
  }

  const handleUpdateLimitFutureBookings = (data: {
    limitFutureBookings: boolean;
  }) => {
    updateLimitFutureBookings(data, {
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
                name="limitFutureBookings"
                control={form.control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={(e) => {
                      field.onChange(e);
                      handleUpdateLimitFutureBookings({
                        limitFutureBookings: e,
                      });
                    }}
                  />
                )}
              />
            </div>
          </CardHeader>
          <motion.div
            layout
            animate={{ height: limitFutureBookings ? "auto" : 0 }}
          >
            <div className="p-6 pt-0">
              <div
                className={cn(
                  "relative flex items-center gap-6 justify-between transition-opacity",
                  !limitFutureBookings && "opacity-50 pointer-events-none",
                )}
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="flex-1">
                    <div className="relative">
                      <Input
                        type="number"
                        id="futureBookingLimitDays"
                        {...form.register("futureBookingLimitDays", {
                          valueAsNumber: true,
                        })}
                        disabled={!limitFutureBookings}
                        className={cn(
                          "w-full h-10 pr-[96px]",
                          form.formState.errors.futureBookingLimitDays &&
                            "border-red-500",
                        )}
                      />
                      <Label
                        htmlFor="futureBookingLimitDays"
                        className="absolute top-1/2 -translate-y-1/2 right-2 text-gray-500"
                      >
                        dias no futuro
                      </Label>
                    </div>
                    <div className="h-5">
                      {form.formState.errors.futureBookingLimitDays && (
                        <p className="text-xs text-red-500 mt-1">
                          {form.formState.errors.futureBookingLimitDays.message}
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
