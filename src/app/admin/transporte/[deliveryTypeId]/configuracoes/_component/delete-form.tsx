"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const PHRASE = "deletar tipo de entrega";

const formSchema = z.object({
  nameConfirmation: z.string().min(1, "Digite o nome para confirmar"),
  phraseConfirmation: z.string().min(1, `Digite '${PHRASE}' para confirmar`),
});

type FormValues = z.infer<typeof formSchema>;

type DeleteFormProps = {
  title: string;
  description: string;
  helpText: string;
  deliveryTypeName: string;
  deliveryTypeStatus?: string;
  lastUpdated?: string;
  onSubmit?: () => void;
  className?: string;
};

export default function DeleteForm({
  title,
  description,
  helpText,
  deliveryTypeName,
  deliveryTypeStatus = "Ativo",
  lastUpdated,
  onSubmit,
  className,
}: DeleteFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameConfirmation: "",
      phraseConfirmation: "",
    },
  });

  const nameValue = watch("nameConfirmation");
  const phraseValue = watch("phraseConfirmation");
  const isNameValid = nameValue === deliveryTypeName;
  const isPhraseValid = phraseValue.trim().toLowerCase() === PHRASE;
  const canDelete = isNameValid && isPhraseValid && !isSubmitting;

  const onSubmitForm = async () => {
    if (canDelete) {
      onSubmit?.();
    }
  };

  return (
    <Card className={cn("border rounded-lg pb-0", className)}>
      <div className="p-6 pb-0">
        <h2 className="text-xl font-semibold mb-1">{title}</h2>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="flex items-center gap-4 border rounded-md p-4 bg-neutral-50 mb-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-red-600 border border-red-200 bg-red-50 rounded px-2 py-1 mb-1 w-fit">
              {deliveryTypeStatus}
            </span>
            <span className="font-medium text-base">{deliveryTypeName}</span>
            {lastUpdated && (
              <span className="text-xs text-muted-foreground">
                Última atualização {lastUpdated}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="bg-red-50 border-t border-red-100 rounded-b-lg px-6 py-4 flex justify-end items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" className="min-w-[90px]">
              Deletar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <div className="bg-red-100 border border-red-300 text-red-700 rounded px-4 py-2 text-sm font-medium mb-4">
              <span className="font-semibold">Atenção:</span> Esta ação não é
              reversível. Tenha certeza.
            </div>
            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
              <div>
                <Label
                  htmlFor="nameConfirmation"
                  className="text-sm font-medium mb-1 block"
                >
                  Digite o nome do tipo de entrega{" "}
                  <span className="font-semibold">{deliveryTypeName}</span> para
                  continuar:
                </Label>
                <Input
                  id="nameConfirmation"
                  {...register("nameConfirmation")}
                  className={cn(
                    "w-full h-10",
                    !isNameValid && nameValue ? "border-red-500" : "",
                  )}
                  placeholder={deliveryTypeName}
                  autoComplete="off"
                />
                {nameValue && !isNameValid && (
                  <p className="text-xs text-red-500 mt-1">
                    O nome não confere.
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="phraseConfirmation"
                  className="text-sm font-medium mb-1 block"
                >
                  Para verificar, digite{" "}
                  <span className="font-semibold">{PHRASE}</span> abaixo:
                </Label>
                <Input
                  id="phraseConfirmation"
                  {...register("phraseConfirmation")}
                  className={cn(
                    "w-full h-10",
                    !isPhraseValid && phraseValue ? "border-red-500" : "",
                  )}
                  placeholder={PHRASE}
                  autoComplete="off"
                />
                {phraseValue && !isPhraseValid && (
                  <p className="text-xs text-red-500 mt-1">
                    A frase não confere.
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="min-w-[90px]"
                  data-cancel-dialog
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  className="min-w-[90px]"
                  disabled={!canDelete}
                >
                  {isSubmitting ? <LoadingDots color="#fff" /> : "Deletar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}
