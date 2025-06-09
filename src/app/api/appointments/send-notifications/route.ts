import { prisma } from "@/lib/prisma";

export async function GET() {
  const appointments = await prisma.appointment.findMany({
    where: {
      date: {
        gte: new Date(),
      },
    },
    include: {
      user: true,
    },
  });

  return new Response(JSON.stringify(appointments));
}