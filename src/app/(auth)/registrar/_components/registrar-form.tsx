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

const registrarSchema = z
	.object({
		name: z.string().min(2, "Nome obrigatório"),
		email: z.string().email("Por favor, insira um email válido"),
		password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

type RegistrarSchema = z.infer<typeof registrarSchema>;

export function RegistrarForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const form = useForm<RegistrarSchema>({
		resolver: zodResolver(registrarSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(values: RegistrarSchema) {
		toast.success(`Registrado: ${values.email}`);
	}

	return (
		<div className={className} {...props}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField control={form.control} name="name">
						{({ field }) => (
							<FormItem>
								<FormLabel>Nome</FormLabel>
								<FormControl>
									<Input placeholder="Digite seu nome..." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					</FormField>
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
					<FormField control={form.control} name="password">
						{({ field }) => (
							<FormItem>
								<FormLabel>Senha</FormLabel>
								<FormControl>
									<Input
										placeholder="Digite sua senha..."
										type="password"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					</FormField>
					<FormField control={form.control} name="confirmPassword">
						{({ field }) => (
							<FormItem>
								<FormLabel>Confirmar Senha</FormLabel>
								<FormControl>
									<Input
										placeholder="Confirme sua senha..."
										type="password"
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
						Registrar
					</Button>
				</form>
			</Form>
		</div>
	);
}
