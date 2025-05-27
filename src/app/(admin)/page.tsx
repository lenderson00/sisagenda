import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminPage() {
	const session = await auth();

	if (!session?.user?.email) {
		return redirect("/404");
	}

	const user = await prisma.user.findUnique({
		where: {
			email: session?.user?.email,
		},
		include: {
			organization: {
				select: {
					id: true,
				},
			},
		},
	});

	return (
		<div>
			{JSON.stringify(user)} <br />
		</div>
	);
}
