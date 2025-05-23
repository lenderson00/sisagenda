"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const isAppSetuped = unstable_cache(async () => {
	const user = await prisma.user.findMany({
		where: {
			role: "SUPER_ADMIN",
		},
	});

	const hasUser = user.length !== 0;

	if (!hasUser) {
		return false;
	}

	return true;
});
