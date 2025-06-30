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
import type { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useUpdateUser } from "../_hooks/use-update-user";

const postoGraduacaoEnum = z.enum([
  "GM",
  "VA",
  "CA",
  "CMG",
  "CF",
  "CC",
  "CT",
  "SO",
  "SG",
  "CB",
  "MN",
]);

function isPostoGraduacao(
  value: unknown,
): value is z.infer<typeof postoGraduacaoEnum> {
  return postoGraduacaoEnum.safeParse(value).success;
}

const userFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  nip: z.string().optional(),
  cpf: z.string().optional(),
  postoGraduacao: postoGraduacaoEnum.optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

type UserInfoFormProps = {
  title: string;
  description: string;
  helpText: string;
  onSubmit?: (data: UserFormValues) => void;
  className?: string;
  initialValues: Partial<UserFormValues>;
  isSubmitting?: boolean;
  isLoading?: boolean;
  user: User;
};

function UserInfoSkeleton({
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

export default function UserInfoForm({
  title,
  description,
  helpText,
  onSubmit,
  className,
  initialValues,
  isSubmitting,
  isLoading,
  user,
}: UserInfoFormProps) {
  const updateUser = useUpdateUser();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: initialValues.name || user.name || "",
      email: initialValues.email || user.email || "",
      nip: initialValues.nip || user.nip || "",
      cpf: initialValues.cpf || user.cpf || "",
      postoGraduacao: isPostoGraduacao(user.postoGraduacao)
        ? user.postoGraduacao
        : undefined,
    },
  });

  const handleSubmit = async (data: UserFormValues) => {
    onSubmit?.(data);
    updateUser.mutate(
      {
        id: user.id,
        ...data,
      },
      {
        onSuccess: () => {
          toast.success("Informações do usuário atualizadas com sucesso");
        },
        onError: () => {
          toast.error("Erro ao atualizar informações do usuário");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <UserInfoSkeleton
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
                      <Input placeholder="Nome do usuário" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email do usuário" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField
                control={form.control}
                name="nip"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>NIP</FormLabel>
                    <FormControl>
                      <Input placeholder="NIP do usuário" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input placeholder="***.123.456-**" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField
                control={form.control}
                name="postoGraduacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Posto/Graduação</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o Posto/Graduação" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {postoGraduacaoEnum.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <CardContent className="flex justify-between items-center bg-neutral-100 h-14 border-t px-6">
            <p className="text-xs text-muted-foreground">{helpText}</p>
            <div className="flex justify-end">
              <FormButton
                isSubmitting={
                  form.formState.isSubmitting || updateUser.isPending
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
