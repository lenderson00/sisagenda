import type { Prisma } from "@prisma/client";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { generateInternalId } from "@/lib/nanoid";
import { prisma } from "@/lib/prisma";

const itemSchema = z.object({
  pi: z.string().optional(),
  name: z.string(),
  unit: z.string(),
  quantity: z.number(),
  price: z.number(),
});

const attachmentSchema = z.object({
  name: z.string(),
  url: z.string(),
  size: z.number(),
  type: z.string(),
});

const createAppointmentInput = z.object({
  organizationId: z.string(),
  deliveryTypeId: z.string(),
  dateTime: z.string().datetime(),
  ordemDeCompra: z.string(),
  notaFiscal: z.string(),
  isFirstDelivery: z.boolean(),
  processNumber: z.string().optional(),
  needsLabAnalysis: z.boolean(),
  items: z.array(itemSchema),
  observation: z.string().optional(),
  attachments: z.array(attachmentSchema),
});

const buildWhere = (tab: string): Prisma.AppointmentWhereInput => {
  switch (tab) {
    case "pendentes":
      return {
        date: {
          gte: new Date(),
        },
        status: {
          in: ["PENDING_CONFIRMATION", "RESCHEDULE_REQUESTED", "CANCELLATION_REQUESTED"],
        },
      };
    case "proximos":
      return {
        date: { gte: new Date() },
        status: { in: ["CONFIRMED", "RESCHEDULE_CONFIRMED"] },
      };
    case "anteriores":
      return { date: { lt: new Date() }, status: { notIn: ["COMPLETED"] } };
    case "cancelados":
      return { status: "CANCELLED" };
    case "concluidos":
      return { status: "COMPLETED" };
    default:
      return {
        date: { gte: new Date() },
        status: { in: ["CONFIRMED", "RESCHEDULE_CONFIRMED"] },
      };
  }
};

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hasTab = req.nextUrl.searchParams.has("tab");

  const tab = req.nextUrl.searchParams.get("tab") || "pendentes";

  const where = buildWhere(tab);

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
      where: hasTab ? where : {},
      orderBy: {
        date: "asc",
      },
      include: {
        deliveryType: true,
        organization: true,
        user: true,
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
    const appointmentData = createAppointmentInput.parse(json);
    const { items, attachments, ...rest } = appointmentData;

    const deliveryType = await prisma.deliveryType.findUnique({
      where: {
        id: rest.deliveryTypeId,
      },
    });

    if (!deliveryType) {
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

    const result = await prisma.$transaction(async (tx) => {
      const appointment = await tx.appointment.create({
        data: {
          ...rest,
          date: rest.dateTime,
          duration: deliveryType.duration,
          userId: user.id,
          status: "PENDING_CONFIRMATION",
          internalId: await generateInternalId(),
          items: {
            create: items.map((item) => ({
              ...item,
            })),
          },
          attachments: {
            create: attachments.map((attachment) => ({
              fileName: attachment.name,
              fileUrl: attachment.url,
              fileSize: attachment.size,
              mimeType: attachment.type,
            })),
          },
        },
      });

      await tx.appointmentActivity.create({
        data: {
          appointmentId: appointment.id,
          userId: user.id,
          type: "CREATED",
          title: "Agendamento Criado",
          content: "Agendamento criado com sucesso.",
          previousStatus: null,
          newStatus: "PENDING_CONFIRMATION",
          priority: 1000,
        },
      });

      return appointment;
    });

    return new Response(JSON.stringify(result), { status: 201 });
  } catch (error) {
    console.error("Failed to create appointment:", error);
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 400 });
    }

    return new Response(
      JSON.stringify({ error: "Ocorreu um erro ao criar o agendamento." }),
      { status: 500 },
    );
  }
}
