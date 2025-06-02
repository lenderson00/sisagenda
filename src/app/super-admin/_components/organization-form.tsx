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

const organizationFormSchema = z.object({
  name: z.string().min(2, "Mínimo 2 letras"),
  sigla: z.string().min(2, "Mínimo 2 letras"),
  description: z.string().optional(),
  role: z.enum(["COMIMSUP", "DEPOSITO", "COMRJ"]),
});

type OrganizationFormValues = z.infer<typeof organizationFormSchema>;

export function OrganizationForm({ onSuccess }: { onSuccess?: () => void }) {
  const createOrganization = useCreateOrganization();
  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: "",
      sigla: "",
      description: "",
      role: "DEPOSITO",
    },
  });

  function onSubmit(values: OrganizationFormValues) {
    createOrganization.mutate(values, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3 w-full"
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
        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={createOrganization.isPending}>
            {createOrganization.isPending
              ? "Creating..."
              : "Create Organization"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
