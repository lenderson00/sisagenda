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
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader } from "@tabler/icons-react";
import type React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { signInWithEmail } from "../../_actions/sign-in";

const loginSchema = z.object({
	email: z.string().email("Por favor, insira um email válido"),
	password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

type LoginSchema = z.infer<typeof loginSchema>;

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const form = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: LoginSchema) {
		const { email, password } = values;

		const res = await signInWithEmail(email, password);

		if (res?.error) {
			toast.error(res.error);
		} else {
			toast.success("Login realizado com sucesso!");
		}
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<div className="flex flex-col gap-6">
				<div className="flex flex-col items-center gap-2">
					<a href="/" className="flex flex-col items-center gap-2 font-medium">
						<div className="flex size-8 items-center justify-center rounded-md">
							{/* <Logo className="size-8" /> */}
						</div>
						<span className="sr-only">SisAgenda</span>
					</a>
					<h1 className="text-xl font-semibold">Bem-vindo ao SisAgenda</h1>
				</div>

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

						<Button
							type="submit"
							disabled={form.formState.isSubmitting}
							className="w-full"
						>
							{form.formState.isSubmitting && (
								<IconLoader className="mr-2 h-4 w-4 animate-spin" />
							)}
							Entrar
						</Button>
					</form>
				</Form>
			</div>

			<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
				Ao continuar, você concorda com nossos
				<a href="/termos-de-servico">Termos de Serviço</a> e
				<a href="/politica-de-privacidade">Política de Privacidade</a>.
			</div>
		</div>
	);
}
