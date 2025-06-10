import { prisma } from "@/lib/prisma";

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email, deletedAt: null },
    include: {
      organization: true,
    },
  });

  return user;
};
