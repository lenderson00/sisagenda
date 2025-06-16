"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CancellationDialogProps {
  appointmentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  reason: string;
}

export function CancellationDialog({
  appointmentId,
  open,
  onOpenChange,
}: CancellationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/appointments/${appointmentId}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason: data.reason,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to request cancellation");
      }

      // Create activity for cancellation request
      await fetch(`/api/appointments/${appointmentId}/activities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "CANCELLED",
          content: `Solicitação de cancelamento: ${data.reason}`,
        }),
      });

      toast.success("Solicitação de cancelamento enviada com sucesso!");
      onOpenChange(false);
      reset();
      router.refresh();
    } catch (error) {
      console.error("Failed to request cancellation:", error);
      toast.error("Erro ao enviar solicitação de cancelamento");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Solicitar Cancelamento</DialogTitle>
          <DialogDescription>
            Por favor, forneça um motivo para solicitar o cancelamento deste
            agendamento.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Motivo do Cancelamento</Label>
              <Textarea
                id="reason"
                placeholder="Explique o motivo pelo qual você precisa cancelar este agendamento..."
                {...register("reason", {
                  required: "Por favor, forneça um motivo para o cancelamento",
                })}
              />
              {errors.reason && (
                <p className="text-sm text-red-600">{errors.reason.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogClose(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} variant="destructive">
              {isSubmitting ? "Enviando..." : "Solicitar Cancelamento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
