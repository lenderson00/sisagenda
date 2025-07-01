"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@prisma/client";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IMaskInput } from "react-imask";
import { toast } from "sonner";
import { z } from "zod";
import { useSendWhatsappToken } from "../_hooks/use-send-whatsapp-token";
import { useUpdateUser } from "../_hooks/use-update-user";
import { useVerifyWhatsappToken } from "../_hooks/use-verify-whatsapp-token";
import { WhatsappFormSkeleton } from "./whatsapp-form-skeleton";
import { WhatsappVerificationDialog } from "./whatsapp-verification-dialog";

const whatsappFormSchema = z.object({
  whatsapp: z.string().optional(),
});

const cleanWhatsappNumber = (number: string) => number.replace(/\D/g, "");

type WhatsappFormValues = z.infer<typeof whatsappFormSchema>;

type WhatsappFormProps = {
  user: User | undefined;
  className?: string;
};

export default function WhatsappForm({ user, className }: WhatsappFormProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const sendToken = useSendWhatsappToken();
  const verifyToken = useVerifyWhatsappToken();
  const updateUser = useUpdateUser();

  const isMutatingForm = updateUser.isPending || sendToken.isPending;

  const form = useForm<WhatsappFormValues>({
    resolver: zodResolver(whatsappFormSchema),
    defaultValues: {
      whatsapp: user?.whatsapp || "",
    },
  });

  const handleVerify = async (token: string) => {
    return new Promise<boolean>((resolve) => {
      verifyToken.mutate(
        { token },
        {
          onSuccess: () => {
            toast.success("WhatsApp verificado com sucesso!");
            setDialogOpen(false);
            resolve(true);
          },
          onError: (error) => {
            toast.error(error.message);
            resolve(false);
          },
        },
      );
    });
  };

  const handleSubmit = async (data: WhatsappFormValues) => {
    if (!data.whatsapp) {
      toast.error("Por favor, insira um número de WhatsApp.");
      return;
    }

    if (!user) {
      toast.error("Usuário não encontrado.");
      return;
    }

    const cleanedWhatsapp = cleanWhatsappNumber(data.whatsapp);

    updateUser.mutate(
      { id: user.id, whatsapp: cleanedWhatsapp },
      {
        onSuccess: () => {
          sendToken.mutate(
            { whatsapp: cleanedWhatsapp },
            {
              onSuccess: () => {
                toast.success(
                  "Número atualizado. Código de verificação enviado!",
                );
                setDialogOpen(true);
              },
              onError: (error) => {
                toast.error(
                  `Erro ao enviar o código: ${
                    error.message || "Tente novamente."
                  }`,
                );
              },
            },
          );
        },
        onError: (error) => {
          toast.error(
            `Erro ao atualizar o número: ${
              error.message || "Tente novamente."
            }`,
          );
        },
      },
    );
  };

  const isSubmitting =
    sendToken.isPending || verifyToken.isPending || updateUser.isPending;

  if (!user || isMutatingForm) {
    return <WhatsappFormSkeleton />;
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={className}>
        <Card className="w-full pb-0 gap-0 overflow-hidden">
          <CardHeader className="pb-4">
            <div className="space-y-2">
              <Label className="text-lg font-semibold text-foreground">
                WhatsApp
              </Label>
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                Verifique seu número de WhatsApp para receber notificações.
              </p>
            </div>
          </CardHeader>
          <div className="p-6 pt-0">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Label
                  htmlFor="whatsapp"
                  className="text-sm font-medium mb-2 block"
                >
                  Número do WhatsApp
                </Label>
                <Controller
                  name="whatsapp"
                  control={form.control}
                  render={({ field }) => (
                    <IMaskInput
                      mask="(00) 00000-0000"
                      placeholder="(XX) XXXXX-XXXX"
                      id="whatsapp"
                      value={field.value}
                      onAccept={field.onChange}
                      disabled={isSubmitting}
                      className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                      )}
                    />
                  )}
                />
              </div>
              {user.whatsappVerified && (
                <Badge className="flex items-center text-sm bg-green-100 text-green-800 border-green-200 hover:bg-green-100/80">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  <span>Verificado</span>
                </Badge>
              )}
            </div>
          </div>
          <CardContent className="flex justify-between items-center bg-neutral-100 h-14 border-t px-6">
            <p className="text-xs text-muted-foreground">
              Enviaremos um código de verificação para este número.
            </p>
            <div className="flex justify-end">
              <FormButton
                isSubmitting={isSubmitting}
                isVerified={!!user.whatsappVerified}
                isNumberUnchanged={user.whatsapp === form.watch("whatsapp")}
              />
            </div>
          </CardContent>
        </Card>
      </form>
      <WhatsappVerificationDialog
        open={isDialogOpen}
        onOpenChange={setDialogOpen}
        onVerify={handleVerify}
      />
    </>
  );
}

type FormButtonProps = {
  isSubmitting: boolean;
  isVerified: boolean;
  isNumberUnchanged: boolean;
};

function FormButton({
  isSubmitting,
  isVerified,
  isNumberUnchanged,
}: FormButtonProps) {
  const getButtonText = () => {
    if (isSubmitting) return <LoadingDots color="#808080" />;
    if (isVerified) {
      if (isNumberUnchanged) {
        return "Verificado";
      }
      return "Salvar e Verificar";
    }
    return "Verificar";
  };
  return (
    <button
      type="submit"
      className={cn(
        "flex !h-8 md:w-fit px-4 text-xs items-center justify-center space-x-2 rounded-md w-full border transition-all focus:outline-none sm:h-10",
        isSubmitting || (isVerified && isNumberUnchanged)
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400"
          : "border-black bg-black text-white hover:opacity-80 cursor-pointer",
      )}
      disabled={isSubmitting || (isVerified && isNumberUnchanged)}
    >
      {getButtonText()}
    </button>
  );
}
