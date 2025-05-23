"use server";

import { authAction } from "@/lib/safe-action";

export const getDashboardData = authAction
	.metadata({
		actionName: "getDashboardData",
	})
	.action(async ({ ctx: { user } }) => {
		console.log(user);

		return {
			message: "Hello, world!",
		};
	});
