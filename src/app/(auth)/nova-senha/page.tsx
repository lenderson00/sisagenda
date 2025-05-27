"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z
	.object({
		password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

type FormSchema = z.infer<typeof schema>;

export default function NovaSenhaPage() {
	const router = useRouter();
	const form = useForm<FormSchema>({
		resolver: zodResolver(schema),
		defaultValues: { password: "", confirmPassword: "" },
	});
	const [loading, setLoading] = useState(false);

	async function onSubmit(values: FormSchema) {
		setLoading(true);
		const res = await fetch("/api/auth/nova-senha", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ password: values.password }),
		});
		if (res.ok) {
			toast.success("Senha alterada com sucesso!");
			router.push("/");
		} else {
			toast.error("Erro ao alterar a senha");
		}
		setLoading(false);
	}

	return (
		<div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="w-full max-w-sm">
				<h1 className="text-xl font-semibold mb-4">Defina uma nova senha</h1>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<Input
							type="password"
							placeholder="Nova senha"
							{...form.register("password")}
						/>
						<Input
							type="password"
							placeholder="Confirme a nova senha"
							{...form.register("confirmPassword")}
						/>
						<Button type="submit" className="w-full" disabled={loading}>
							{loading ? "Salvando..." : "Salvar nova senha"}
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
