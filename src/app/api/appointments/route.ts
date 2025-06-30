import type { Prisma, UserRole } from "@prisma/client";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { generateInternalId } from "@/lib/nanoid";
import { prisma } from "@/lib/prisma";
import { AppointmentService } from "@/lib/services/appointment-service";

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

const buildWhere = (tab: string, role?: UserRole, userId?: string): Prisma.AppointmentWhereInput => {
  let where: Prisma.AppointmentWhereInput = {};

  if (role === "FORNECEDOR") {
    where = {
      userId,
    };
  }

  switch (tab) {
    case "pendentes":
      return {
        ...where,
        date: {
          gte: new Date(),
        },
        status: {
          in: [
            "PENDING_CONFIRMATION",
            "RESCHEDULE_REQUESTED",
            "CANCELLATION_REQUESTED",
          ],
        },
      };
    case "proximos":
      return {
        ...where,
        date: { gte: new Date() },
        status: { in: ["CONFIRMED", "RESCHEDULE_CONFIRMED"] },
      };
    case "anteriores":
      return {
        ...where,
        date: { lt: new Date() },
        status: { notIn: ["COMPLETED"] },
      };
    case "cancelados":
      return { ...where, status: "CANCELLED" };
    case "concluidos":
      return { ...where, status: "COMPLETED" };
    default:
      return {
        ...where,
        date: { gte: new Date() },
        status: { in: ["CONFIRMED", "RESCHEDULE_CONFIRMED"] },
      };
  }
};

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session || !session.user.role || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hasTab = req.nextUrl.searchParams.has("tab");
  const fornecedor = session.user.role === "FORNECEDOR";

  const tab = req.nextUrl.searchParams.get("tab") || "pendentes";

  const where = buildWhere(tab, session.user.role as UserRole, session.user.id);

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

  const finalWhere = hasTab ? where : fornecedor ? { userId: session.user.id } : {};

  console.log(finalWhere);

  try {
    const appointments = await prisma.appointment.findMany({
      where: finalWhere,
      orderBy: {
        date: "asc",
      },
      include: {
        deliveryType: true,
        organization: true,
        user: true,
        items: true,
        attachments: true,
      },
    });

    // Convert Decimal values to numbers for serialization
    const serializedAppointments = appointments.map((appointment) => ({
      ...appointment,
      items: appointment.items.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
    }));

    return NextResponse.json(serializedAppointments);
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
    const { items, attachments, dateTime, ...rest } = appointmentData;

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
          date: new Date(dateTime),
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

    // Notify OM users
    await AppointmentService.notifyAppointmentCreated(
      result.id,
      result.organizationId,
      result.userId
    );

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
