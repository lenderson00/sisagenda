"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useState } from "react";
import CardItem from "./_components/om-card";

// Tipo para os dados do card
type Card = {
	id: string;
	title: string;
	agendamentos?: string;
};

export default function CardsPage() {
	// Estado para armazenar os cards
	const [cards, setCards] = useState<Card[]>([
		{
			id: "1",
			title: "Projeto Website",
			agendamentos: "10/05/2025",
		},
		{
			id: "2",
			title: "Aplicativo Mobile",
			agendamentos: "15/05/2025",
		},
		{
			id: "3",
			title: "Dashboard Admin",
			agendamentos: "20/05/2025",
		},
	]);

	// Estado para o formulário
	const [newCard, setNewCard] = useState({
		title: "",
	});

	// Função para adicionar um novo card
	const handleAddCard = () => {
		if (newCard.title.trim() === "") return;

		const card: Omit<Card, "agendamentos"> = {
			id: Date.now().toString(),
			title: newCard.title,
		};

		setCards([...cards, card]);
		setNewCard({ title: "" });
	};

	return (
		<main className="">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">Meus Cards</h1>

				<Dialog>
					<DialogTrigger asChild>
						<Button className="bg-emerald-600 hover:bg-emerald-700">
							<Plus className="mr-2 h-4 w-4" />
							Criar Novo
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Criar Novo Card</DialogTitle>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label htmlFor="title">Sliga da OM</Label>
								<Input
									id="title"
									value={newCard.title}
									onChange={(e) =>
										setNewCard({ ...newCard, title: e.target.value })
									}
									placeholder="Digite o título do card"
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="title">Nome da OM</Label>
								<Input
									id="title"
									value={newCard.title}
									onChange={(e) =>
										setNewCard({ ...newCard, title: e.target.value })
									}
									placeholder="Digite o título do card"
								/>
							</div>
						</div>
						<Button
							onClick={handleAddCard}
							className="w-full bg-emerald-600 hover:bg-emerald-700"
						>
							Adicionar Card
						</Button>
					</DialogContent>
				</Dialog>
			</div>

			{cards.length === 0 ? (
				<div className="text-center py-12 bg-gray-50 rounded-lg">
					<p className="text-gray-500">
						Nenhum card encontrado. Crie um novo card para começar.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{cards.map((card) => (
						<CardItem key={card.id} card={card} />
					))}
				</div>
			)}
		</main>
	);
}
