import { z } from "zod";

import { auth } from "@/lib/auth";
import { generateInternalId } from "@/lib/nanoid";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const createAppointmentInput = z.object({
  organizationId: z.string(),
  deliveryTypeId: z.string(),
  dateTime: z.string().datetime(),
  ordemDeCompra: z.string(),
  observations: z.record(z.any()),
});

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!session.user.organizationId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const organization = await prisma.organization.findUnique({
    where: {
      id: session.user.organizationId,
    },
  });

  if (!organization) {
    return NextResponse.json(
      { error: "Organization not found" },
      { status: 404 },
    );
  }

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        organizationId: session.user.organizationId,
        deletedAt: null,
        userId: session.user.id,
      },
      orderBy: {
        date: "asc",
      },
      include: {
        organization: {
          select: {
            name: true,
          },
        },
        activities: true,
        deliveryType: true,
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session || !session.user.email) {
    return new Response(JSON.stringify({ error: "Usuário não autenticado." }), {
      status: 401,
    });
  }

  try {
    const json = await req.json();
    const validatedInput = createAppointmentInput.parse(json);

    const deliverySettings = await prisma.availabilitySettings.findUnique({
      where: {
        deliveryTypeId: validatedInput.deliveryTypeId,
      },
    });

    if (!deliverySettings) {
      return new Response(
        JSON.stringify({
          error:
            "Configurações de agendamento não encontradas para este tipo de entrega.",
        }),
        { status: 404 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Usuário não encontrado." }),
        { status: 404 },
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        organizationId: validatedInput.organizationId,
        deliveryTypeId: validatedInput.deliveryTypeId,
        date: new Date(validatedInput.dateTime),
        duration: deliverySettings.duration,
        ordemDeCompra: validatedInput.ordemDeCompra,
        observations: validatedInput.observations,
        userId: user.id,
        status: "PENDING_CONFIRMATION",
        internalId: generateInternalId(),
      },
    });

    return new Response(JSON.stringify(appointment), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 400 });
    }

    return new Response(
      JSON.stringify({ error: "Ocorreu um erro ao criar o agendamento." }),
      { status: 500 },
    );
  }
}
