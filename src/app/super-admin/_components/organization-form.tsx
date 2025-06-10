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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateOrganization } from "../_hooks/use-create-organization";
import { useUpdateOrganization } from "../_hooks/use-update-organization";

const organizationFormSchema = z.object({
  name: z.string().min(2, "Mínimo 2 letras"),
  sigla: z.string().min(2, "Mínimo 2 letras"),
  description: z.string().optional(),
  role: z.enum(["COMIMSUP", "DEPOSITO", "COMRJ"]),
});

type OrganizationFormValues = z.infer<typeof organizationFormSchema>;

// Just a type for the organization prop
type Organization = {
  id: string;
  name: string;
  sigla: string;
  description: string | null;
  role: "COMIMSUP" | "DEPOSITO" | "COMRJ";
};

export function OrganizationForm({
  onSuccess,
  organization,
}: {
  onSuccess?: () => void;
  organization?: Organization;
}) {
  const createOrganization = useCreateOrganization();
  const updateOrganization = useUpdateOrganization();

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: organization?.name ?? "",
      sigla: organization?.sigla ?? "",
      description: organization?.description ?? "",
      role: organization?.role ?? "DEPOSITO",
    },
  });

  const isEditing = !!organization;

  function onSubmit(values: OrganizationFormValues) {
    if (isEditing) {
      updateOrganization.mutate(
        { id: organization.id, ...values },
        {
          onSuccess: () => {
            form.reset();
            onSuccess?.();
          },
        }
      );
    } else {
      createOrganization.mutate(values, {
        onSuccess: () => {
          form.reset();
          onSuccess?.();
        },
      });
    }
  }

  const isLoading = createOrganization.isPending || updateOrganization.isPending;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3 w-full px-4 md:px-0 mb-4"
      >
        <div className="flex gap-2 w-full items-start">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Organization name" {...field} />
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
                  <Input placeholder="Organization sigla" {...field} />
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
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about the organization"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="w-full mb-2">
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="COMIMSUP">COMIMSUP</SelectItem>
                  <SelectItem value="COMRJ">COMRJ</SelectItem>
                  <SelectItem value="DEPOSITO">DEPOSITO</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* TODO: Add comimsupId field - it should be a select showing other organizations with role COMIMSUP. Hide if current role is COMIMSUP */}
        {/* TODO: Add isActive field - it should be a switch */}
        <div className="flex w-full">

          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? isEditing
                ? "Saving..."
                : "Creating..."
              : isEditing
                ? "Save Changes"
                : "Create Organization"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
