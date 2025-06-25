import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getSchedules() {
  const session = await auth();

  if (!session?.user?.organizationId) {
    throw new Error(
      "User is not authenticated or does not belong to an organization.",
    );
  }

  const schedules = await prisma.schedule.findMany({
    where: {
      organizationId: session.user.organizationId,
    },
    include: {
      availability: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return schedules;
}
