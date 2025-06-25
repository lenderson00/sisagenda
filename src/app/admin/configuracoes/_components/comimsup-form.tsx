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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Organization } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useComimsups } from "../_hooks/use-comimsups";
import { useUpdateOrganization } from "../_hooks/use-update-organization";

const comimsupFormSchema = z.object({
  comimsupId: z.string().optional(),
});

type ComimsupFormValues = z.infer<typeof comimsupFormSchema>;

type ComimsupFormProps = {
  title: string;
  description: string;
  helpText: string;
  onSubmit?: (data: ComimsupFormValues) => void;
  className?: string;
  initialValues?: Partial<ComimsupFormValues>;
  isSubmitting?: boolean;
  isLoading?: boolean;
  organization: Organization;
};

function ComimsupSkeleton({
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

export default function ComimsupForm({
  title,
  description,
  helpText,
  onSubmit,
  className,
  initialValues,
  isSubmitting,
  isLoading,
  organization,
}: ComimsupFormProps) {
  const updateOrganization = useUpdateOrganization();
  const { data: comimsups = [], isLoading: isComimsupsLoading } =
    useComimsups();

  const form = useForm<ComimsupFormValues>({
    resolver: zodResolver(comimsupFormSchema),
    defaultValues: {
      comimsupId:
        initialValues?.comimsupId || organization.comimsupId || "none",
    },
  });

  const handleSubmit = async (data: ComimsupFormValues) => {
    onSubmit?.(data);
    updateOrganization.mutate(
      {
        id: organization.id,
        comimsupId: data.comimsupId === "none" ? null : data.comimsupId,
      },
      {
        onSuccess: () => {
          toast.success("COMIMSUP atualizado com sucesso");
        },
        onError: () => {
          toast.error("Erro ao atualizar COMIMSUP");
        },
      },
    );
  };

  if (isLoading || isComimsupsLoading) {
    return (
      <ComimsupSkeleton
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
            <FormField
              control={form.control}
              name="comimsupId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Selecionar COMIMSUP</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um COMIMSUP" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Nenhum COMIMSUP</SelectItem>
                      {comimsups.map((comimsup) => (
                        <SelectItem key={comimsup.id} value={comimsup.id}>
                          {comimsup.name} ({comimsup.sigla})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
