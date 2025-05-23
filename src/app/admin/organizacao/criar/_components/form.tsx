"use client";

import {
	type CreateOrganizationInput,
	createOrganization,
	createOrganizationSchema,
} from "@/actions/organization";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function OrganizationForm() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<CreateOrganizationInput>({
		resolver: zodResolver(createOrganizationSchema),
		defaultValues: {
			name: "",
			sigla: "",
			description: "",
		},
	});

	async function onSubmit(values: CreateOrganizationInput) {
		setIsSubmitting(true);

		try {
			const result = await createOrganization(values);

			if (result?.data) {
				toast.success("Organization created");
				router.push("/admin/organizacao");
			} else {
				toast.error("Failed to create organization");
			}
		} catch (error) {
			toast.error("An unexpected error occurred");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle>Create Organization</CardTitle>
				<CardDescription>
					Add a new organization to the scheduling system. Organizations start
					with a 'pending' status until an administrator is registered.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Organization Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter organization name" {...field} />
									</FormControl>
									<FormDescription>
										The full name of the organization
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="sigla"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Sigla</FormLabel>
									<FormControl>
										<Input placeholder="e.g., NASA, WHO" {...field} />
									</FormControl>
									<FormDescription>
										A short abbreviation for the organization (2-10 characters)
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Describe the organization's purpose and activities"
											className="min-h-[100px]"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										A brief description of the organization
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end gap-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => router.push("/organizations")}
								disabled={isSubmitting}
							>
								Cancelar
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? "Criando..." : "Criar Organização"}
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
