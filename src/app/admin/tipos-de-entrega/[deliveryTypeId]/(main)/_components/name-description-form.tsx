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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type NameDescriptionFormProps = {
  initialValues?: FormValues;
  onSubmit: (data: FormValues) => void;
  isSubmitting: boolean;
};

export function NameDescriptionForm({
  initialValues,
  onSubmit,
  isSubmitting,
}: NameDescriptionFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card className="w-full pb-0 gap-4 overflow-hidden">
        <CardHeader>
          <CardTitle>Nome e Descrição</CardTitle>
          <CardDescription>
            Atualize o nome e a descrição do seu tipo de entrega.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="e.g. Entrega de Materiais"
            />
            <div className="h-3">
              {form.formState.errors.name && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Descreva o tipo de entrega."
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center bg-neutral-100 h-14 mt-6 border-t !p-4">
          <p className="text-xs text-muted-foreground">
            O nome será usado para criar um slug amigável.
          </p>
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
        </CardFooter>
      </Card>
    </form>
  );
}
