"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  minAntecedence: z
    .number()
    .min(1, "O número de dias deve ser maior que 0")
    .max(30, "O número de dias deve ser menor que 30"),
});

type FormValues = z.infer<typeof formSchema>;

type MinAntecedenceFormProps = {
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

function MinAntecedenceSkeleton({
  title,
  description,
  helpText,
  className,
}: {
  title: string;
  description: string;
  helpText: string;
  className?: string;
}) {
  return (
    <div className={className}>
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
            <Skeleton className="h-6 w-11 rounded-full" />
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}

export default function MinAntecedenceForm({
  title,
  description,
  helpText,
  onSubmit,
  className,
  initialValues,
  isSubmitting,
  isLoading,
  deliveryTypeId,
}: MinAntecedenceFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      minAntecedence: initialValues?.minAntecedence || 2,
    },
  });

  const handleSubmit = async (data: FormValues) => {
    onSubmit?.(data);
    await queryClient.invalidateQueries({
      queryKey: ["delivery-type", deliveryTypeId],
    });
  };

  if (isLoading) {
    return (
      <MinAntecedenceSkeleton
        title={title}
        description={description}
        helpText={helpText}
        className={className}
      />
    );
  }

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
            </div>
          </CardHeader>
          <motion.div layout animate={{ height: "auto" }}>
            <div className="p-6 pt-0">
              <div className="relative flex items-center gap-6 justify-between">
                <div className="flex items-center gap-4 w-full">
                  <div className="flex-1">
                    <div className="relative">
                      <Input
                        type="number"
                        id="minAntecedence"
                        {...form.register("minAntecedence", {
                          valueAsNumber: true,
                        })}
                        className={cn(
                          "w-full h-10 pr-[96px]",
                          form.formState.errors.minAntecedence &&
                            "border-red-500",
                        )}
                      />
                      <Label
                        htmlFor="minAntecedence"
                        className="absolute top-1/2 -translate-y-1/2 right-2 text-gray-500"
                      >
                        dias de antecedência
                      </Label>
                    </div>
                    <div className="h-5">
                      {form.formState.errors.minAntecedence && (
                        <p className="text-xs text-red-500 mt-1">
                          {form.formState.errors.minAntecedence.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="flex justify-between items-center bg-neutral-100 h-14 mt-2 border-t">
              <p className="text-xs text-muted-foreground">{helpText}</p>
              <button
                type="submit"
                className="bg-primary text-white rounded px-4 py-2 text-xs font-semibold disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Salvando..." : "Salvar"}
              </button>
            </CardContent>
          </motion.div>
        </Card>
      </form>
    </AnimatePresence>
  );
}
