"use client";

import LoadingDots from "@/components/icons/loading-dots";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  duration: z.coerce
    .number()
    .min(15, "A duração deve ser de no mínimo 15 minutos"),
});

type FormValues = z.infer<typeof formSchema>;

type DurationFormProps = {
  initialValues?: FormValues;
  onSubmit: (data: FormValues) => void;
  isSubmitting: boolean;
};

export function DurationForm({
  initialValues,
  onSubmit,
  isSubmitting,
}: DurationFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card className="w-full pb-0 gap-4 overflow-hidden">
        <CardHeader>
          <CardTitle>Duração</CardTitle>
          <CardDescription>
            Defina a duração padrão para este tipo de entrega em minutos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="duration">Duração (em minutos)</Label>
            <div className="flex items-center relative">
              <Input
                placeholder="Digite a duração do tipo de entrega em minutos"
                {...form.register("duration")}
                type="number"
                className="border-muted pr-[72px]"
                defaultValue={form.getValues("duration")}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                minutos
              </span>
            </div>
            <div className="h-4">
              {form.formState.errors.duration && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.duration.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center bg-neutral-100 h-14 mt-2 border-t !p-4">
          <p className="text-xs text-muted-foreground">
            A duração será usada para calcular os horários disponíveis.
          </p>
          <button
            type="submit"
            className={cn(
              "flex !h-8 md:w-fit px-4 text-xs items-center justify-center space-x-2 rounded-md w-full border  transition-all focus:outline-none sm:h-10 ",
              isSubmitting
                ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400  "
                : "border-black bg-black text-white  hover:opacity-80 cursor-pointer  ",
            )}
            disabled={isSubmitting}
          >
            {isSubmitting ? <LoadingDots color="#808080" /> : <p>Salvar</p>}
          </button>
        </CardFooter>
      </Card>
    </form>
  );
}
