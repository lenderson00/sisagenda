"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const PHRASE = "deletar tipo de entrega";

const formSchema = z.object({
  nameConfirmation: z.string().min(1, "Digite o nome para confirmar"),
  phraseConfirmation: z.string().min(1, `Digite '${PHRASE}' para confirmar`),
});

type FormValues = z.infer<typeof formSchema>;

interface DeleteFormProps {
  title: string;
  description: string;
  helpText: string;
  onSubmit: () => Promise<void>;
  deliveryTypeName: string;
  deliveryTypeStatus: string;
  lastUpdated: string;
}

export default function DeleteForm({
  title,
  description,
  helpText,
  onSubmit,
  deliveryTypeName,
  deliveryTypeStatus,
  lastUpdated,
}: DeleteFormProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameConfirmation: "",
      phraseConfirmation: "",
    },
  });

  const nameValue = form.watch("nameConfirmation");
  const phraseValue = form.watch("phraseConfirmation");
  const isNameValid = nameValue === deliveryTypeName;
  const isPhraseValid = phraseValue.trim().toLowerCase() === PHRASE;
  const canDelete =
    isNameValid && isPhraseValid && !form.formState.isSubmitting;

  const handleSubmit = async () => {
    if (canDelete) {
      try {
        await onSubmit();
        await queryClient.invalidateQueries({
          queryKey: ["deliveryTypeConfig"],
        });
        toast.success("Delivery type deleted successfully");
        router.push("/transporte");
      } catch (error) {
        toast.error("Failed to delete delivery type");
      }
    }
  };

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="text-red-600">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Name: {deliveryTypeName}</p>
            <p className="text-sm font-medium">Status: {deliveryTypeStatus}</p>
            <p className="text-sm font-medium">Last Updated: {lastUpdated}</p>
          </div>
          <p className="text-sm text-red-500">{helpText}</p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                Delete Delivery Type
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
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <div>
                  <Label
                    htmlFor="nameConfirmation"
                    className="text-sm font-medium mb-1 block"
                  >
                    Digite o nome do tipo de entrega{" "}
                    <span className="font-bold">{deliveryTypeName}</span> para
                    continuar:
                  </Label>
                  <Input
                    id="nameConfirmation"
                    {...form.register("nameConfirmation")}
                    className={`w-full h-10 ${
                      !isNameValid && nameValue ? "border-red-500" : ""
                    }`}
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
                    <span className="font-bold">{PHRASE}</span> abaixo:
                  </Label>
                  <Input
                    id="phraseConfirmation"
                    {...form.register("phraseConfirmation")}
                    className={`w-full h-10 ${
                      !isPhraseValid && phraseValue ? "border-red-500" : ""
                    }`}
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
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="min-w-[90px]"
                    >
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    variant="destructive"
                    className="min-w-[90px]"
                    disabled={!canDelete}
                  >
                    {form.formState.isSubmitting ? (
                      <LoadingDots color="#fff" />
                    ) : (
                      "Deletar"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
