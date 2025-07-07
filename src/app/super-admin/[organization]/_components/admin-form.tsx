"use client";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateAdmin } from "../_hooks/use-create-admin";
import { ImageUpload } from "@/components/ui/image-upload";
import { applyNipMask, isValidNip, removeNipMask } from "@/lib/masks";
import { useImageUploadValidation } from "@/hooks/use-image-upload-validation";
import { toast } from "sonner";

const adminFormSchema = z.object({
  name: z.string().min(2, "Mínimo 2 letras"),
  email: z.string().email("Email inválido"),
  postoGraduacao: z.string().min(2, "Mínimo 2 letras"),
  nip: z.string().refine(isValidNip, {
    message: "O NIP deve ter 8 dígitos.",
  }),
  image: z.string().optional(),
});

type AdminFormValues = z.infer<typeof adminFormSchema>;

interface AdminFormProps {
  organizationId: string;
}

export function AdminForm({ organizationId }: AdminFormProps) {
  const queryClient = useQueryClient();
  const createAdmin = useCreateAdmin();

  const {
    isValidating,
    validationErrors,
    validateFormWithImage,
    clearValidationErrors,
  } = useImageUploadValidation({
    onValidationError: (error) => {
      toast.error(error);
    },
  });

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      name: "",
      email: "",
      postoGraduacao: "",
      image: undefined,
      nip: "",
    },
  });

  // Handler for NIP mask
  const handleNipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = applyNipMask(e.target.value);
    form.setValue("nip", masked);
  };

  // Handler for image upload
  const handleImageChange = (url: string | null) => {
    form.setValue("image", url || undefined);
    // Clear validation errors when image changes
    clearValidationErrors();
  };

  async function onSubmit(values: AdminFormValues) {
    // Validate that the image is uploaded before submitting
    const isValid = await validateFormWithImage(values.image);

    if (!isValid) {
      return;
    }

    createAdmin.mutate(
      { ...values, organizationId, nip: removeNipMask(values.nip) },
      {
        onSuccess: () => {
          form.reset();
          queryClient.invalidateQueries({
            queryKey: ["admins", organizationId],
          });
          toast.success("Administrador criado com sucesso!");
        },
        onError: (error) => {
          if (error.message.includes("User already exists")) {
            toast.error("Este email já está em uso.");
          } else {
            toast.error(
              "Ocorreu um erro ao criar o administrador. Por favor, tente novamente.",
            );
          }
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3 w-full px-4 md:px-0"
      >
        <div className="flex flex-col items-center mb-2">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Foto do Admin</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={handleImageChange}
                    size="lg"
                  />
                </FormControl>
                <FormMessage />
                {validationErrors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {validationErrors[0]}
                  </p>
                )}
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-3 md:flex-row">
          <FormField
            control={form.control}
            name="postoGraduacao"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Posto/Graduacao</FormLabel>
                <FormControl>
                  <Input placeholder="Posto/Graduacao" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nome de Guerra</FormLabel>
                <FormControl>
                  <Input placeholder="Nome de Guerra do ADMIN" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="nip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIP</FormLabel>
              <FormControl>
                <Input
                  placeholder="XX.XXXX.XX"
                  {...field}
                  value={field.value}
                  onChange={handleNipChange}
                  maxLength={10}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email do ADMIN" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 mt-4">
          <Button
            type="submit"
            disabled={createAdmin.isPending || isValidating}
            className="w-full"
          >
            {createAdmin.isPending || isValidating
              ? "Validando..."
              : "Criar Administrador"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
