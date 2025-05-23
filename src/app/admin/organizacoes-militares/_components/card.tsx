import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Organization } from "@prisma/client";
import {
	IconCalendar,
	IconClock,
	IconHeart,
	IconMapPin,
	IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";

interface OrganizationCardProps {
	organization: Organization;
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
	const { id, name, sigla, createdAt } = organization;

	// Generate a color based on the organization name for the avatar
	const getAvatarColor = (name: string) => {
		const colors = [
			"bg-blue-500",
			"bg-green-500",
			"bg-purple-500",
			"bg-orange-500",
			"bg-pink-500",
			"bg-indigo-500",
			"bg-teal-500",
			"bg-red-500",
		];
		const index = name.length % colors.length;
		return colors[index];
	};

	const formatTimeAgo = (date: Date) => {
		const now = new Date();
		const diffInHours = Math.floor(
			(now.getTime() - date.getTime()) / (1000 * 60 * 60),
		);

		if (diffInHours < 1) return "Posted less than 1 hour ago";
		if (diffInHours < 24) return `Posted ${diffInHours} hours ago`;

		const diffInDays = Math.floor(diffInHours / 24);
		if (diffInDays < 30) return `Posted ${diffInDays} days ago`;

		const diffInMonths = Math.floor(diffInDays / 30);
		return `Posted ${diffInMonths} months ago`;
	};

	return (
		<Card className="w-full hover:shadow-md transition-shadow duration-200">
			<CardContent className="p-4">
				<div className="flex items-start gap-4">
					{/* Avatar */}
					<div
						className={`w-12 h-12 rounded-full ${getAvatarColor(name)} flex items-center justify-center flex-shrink-0`}
					>
						<span className="text-white font-bold text-lg">
							{sigla.charAt(0).toUpperCase()}
						</span>
					</div>

					{/* Main Content */}
					<div className="flex-1 min-w-0">
						<div className="flex items-start justify-between mb-2">
							<div>
								<h3 className="font-semibold text-lg text-gray-900 truncate">
									{name}
								</h3>
								<p className="text-sm text-gray-600">{sigla}</p>
							</div>
							<button
								type="button"
								className="text-gray-400 hover:text-red-500 transition-colors p-1"
							>
								<IconHeart className="w-5 h-5" />
							</button>
						</div>

						{/* Location-style info */}
						<div className="flex items-center gap-1 mb-2">
							<IconMapPin className="w-4 h-4 text-gray-500" />
							<span className="text-sm text-gray-600">
								{status === "active"
									? "Active Organization"
									: "Pending Approval"}
							</span>
						</div>

						{/* Time posted */}
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-1">
								<IconClock className="w-4 h-4 text-gray-400" />
								<span className="text-xs text-gray-500">
									{formatTimeAgo(createdAt)}
								</span>
							</div>

							<Button asChild variant="outline" size="sm" className="ml-auto">
								<Link href={`/admin/organizacoes-militares/${id}`}>
									Ver detalhes
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
