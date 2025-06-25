"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Organization } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useUpdateOrganization } from "../_hooks/use-update-organization";

const organizationFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  sigla: z.string().min(2, "Sigla deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
});

type OrganizationFormValues = z.infer<typeof organizationFormSchema>;

type OrganizationInfoFormProps = {
  title: string;
  description: string;
  helpText: string;
  onSubmit?: (data: OrganizationFormValues) => void;
  className?: string;
  initialValues: Partial<OrganizationFormValues>;
  isSubmitting?: boolean;
  isLoading?: boolean;
  organization: Organization;
};

function OrganizationInfoSkeleton({
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
          <div className="space-y-2">
            <Label className="text-lg font-semibold text-foreground">
              {title}
            </Label>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">
              {description}
            </p>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}

export default function OrganizationInfoForm({
  title,
  description,
  helpText,
  onSubmit,
  className,
  initialValues,
  isSubmitting,
  isLoading,
  organization,
}: OrganizationInfoFormProps) {
  const updateOrganization = useUpdateOrganization();

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: initialValues.name || organization.name,
      sigla: initialValues.sigla || organization.sigla,
      description: initialValues.description || organization.description || "",
    },
  });

  const handleSubmit = async (data: OrganizationFormValues) => {
    onSubmit?.(data);
    updateOrganization.mutate(
      {
        id: organization.id,
        ...data,
      },
      {
        onSuccess: () => {
          toast.success("Informações da organização atualizadas com sucesso");
        },
        onError: () => {
          toast.error("Erro ao atualizar informações da organização");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <OrganizationInfoSkeleton
        title={title}
        description={description}
        helpText={helpText}
        className={className}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={className}>
        <Card className="w-full pb-0 gap-0 overflow-hidden">
          <CardHeader className="pb-4">
            <div className="space-y-2">
              <Label className="text-lg font-semibold text-foreground">
                {title}
              </Label>
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                {description}
              </p>
            </div>
          </CardHeader>
          <div className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da organização" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sigla"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Sigla</FormLabel>
                    <FormControl>
                      <Input placeholder="Sigla da organização" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrição da organização"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <CardContent className="flex justify-between items-center bg-neutral-100 h-14 border-t px-6">
            <p className="text-xs text-muted-foreground">{helpText}</p>
            <div className="flex justify-end">
              <FormButton
                isSubmitting={
                  form.formState.isSubmitting || updateOrganization.isPending
                }
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
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
