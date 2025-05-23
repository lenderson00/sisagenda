import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import Link from "next/link";

type CardProps = {
	card: {
		id: string;
		title: string;
		agendamentos?: string;
	};
};

export default function CardItem({ card }: CardProps) {
	return (
		<Link href={`/om/${card.id}`}>
			<Card className="h-full flex flex-col transition-all hover:shadow-md">
				<CardHeader>
					<CardTitle className="text-2xl font-bold">{card.title}</CardTitle>
				</CardHeader>
				<CardFooter className="text-sm text-gray-500 flex items-center">
					<span>{card.agendamentos || 0} Agendamentos</span>
				</CardFooter>
			</Card>
		</Link>
	);
}
