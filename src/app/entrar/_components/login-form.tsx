"use client";

import { Button } from "@/components/ui/button";
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
import {
	IconBrandApple,
	IconBrandGoogle,
	IconLoader,
} from "@tabler/icons-react";
import type React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { signInWithGoogle } from "../_actions/sign-in";

const loginSchema = z.object({
	email: z.string().email("Por favor, insira um email válido"),
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
		},
	});

	async function onSubmit(values: LoginSchema) {
		const { email } = values;
		toast.success(`Email: ${email}`);
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<div className="flex flex-col gap-6">
				<div className="flex flex-col items-center gap-2">
					<a href="/" className="flex flex-col items-center gap-2 font-medium">
						<div className="flex size-8 items-center justify-center rounded-md">
							<Logo className="size-8" />
						</div>
						<span className="sr-only">Sisgenda</span>
					</a>
					<h1 className="text-xl font-semibold">Bem-vindo ao Sisgenda</h1>
				</div>

				<FormProvider {...form}>
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
							Entrar
						</Button>
					</form>
				</FormProvider>

				<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
					<span className="bg-background text-muted-foreground relative z-10 px-2">
						Ou entre com
					</span>
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					<Button
						variant="outline"
						type="button"
						className="w-full"
						onClick={signInWithGoogle}
					>
						<IconBrandGoogle className="mr-2 size-4" />
						Google
					</Button>
					<Button variant="outline" type="button" className="w-full">
						<IconBrandApple className="mr-2 size-4" />
						Apple
					</Button>
				</div>
			</div>

			<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
				Ao continuar, você concorda com nossos
				<a href="/termos-de-servico">Termos de Serviço</a> e
				<a href="/politica-de-privacidade">Política de Privacidade</a>.
			</div>
		</div>
	);
}
