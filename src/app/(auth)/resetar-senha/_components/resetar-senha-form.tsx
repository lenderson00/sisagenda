"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormProvider,
} from "@/components/ui/form-skeleton";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader } from "@tabler/icons-react";
import type React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const resetarSenhaSchema = z.object({
	email: z.string().email("Por favor, insira um email válido"),
});

type ResetarSenhaSchema = z.infer<typeof resetarSenhaSchema>;

export function ResetarSenhaForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const form = useForm<ResetarSenhaSchema>({
		resolver: zodResolver(resetarSenhaSchema),
		defaultValues: {
			email: "",
		},
	});

	async function onSubmit(values: ResetarSenhaSchema) {
		toast.success(`Email enviado para: ${values.email}`);
	}

	return (
		<div className={className} {...props}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField control={form.control} name="email">
						{({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										placeholder="Digite seu email..."
										type="email"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					</FormField>
					<Button
						type="submit"
						disabled={form.formState.isSubmitting}
						className="w-full"
					>
						{form.formState.isSubmitting && (
							<IconLoader className="mr-2 h-4 w-4 animate-spin" />
						)}
						Enviar
					</Button>
				</form>
			</Form>
		</div>
	);
}
