import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const createOrganizationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sigla: z.string().min(1, "Sigla is required"),
  description: z.string().optional(),
  role: z.enum(["COMIMSUP", "DEPOSITO", "COMRJ"]),
  isActive: z.boolean().optional().default(true),
  comimsupId: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") as
      | "COMIMSUP"
      | "DEPOSITO"
      | "COMRJ"
      | undefined;

    const organizations = await prisma.organization.findMany({
      where: {
        deletedAt: null,
        role: role ?? undefined,
      },
      include: {
        comimsup: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(organizations);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch organizations" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is super admin
    if (session.user.role !== "SUPER_ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const validatedData = createOrganizationSchema.parse(body);

    console.log(validatedData);

    const organization = await prisma.$transaction(async (prisma) => {
      const organization = await prisma.organization.create({
        data: {
          name: validatedData.name,
          sigla: validatedData.sigla,
          description: validatedData.description,
          role: validatedData.role,
          isActive: validatedData.isActive,
          comimsupId:
            validatedData.role === "DEPOSITO" && validatedData.comimsupId !== ""
              ? validatedData.comimsupId
              : null,
        },
      });

      // 1. Create a default schedule
      const defaultSchedule = await prisma.schedule.create({
        data: {
          name: "Horário Padrão",
          organizationId: organization.id,
          isDefault: true,
          availability: {
            createMany: {
              data: [
                // Monday to Friday, 9 AM to 5 PM
                { weekDay: 1, startTime: 9 * 60, endTime: 15 * 60, organizationId: organization.id },
                { weekDay: 2, startTime: 9 * 60, endTime: 15 * 60, organizationId: organization.id },
                { weekDay: 3, startTime: 9 * 60, endTime: 15 * 60, organizationId: organization.id },
                { weekDay: 4, startTime: 9 * 60, endTime: 15 * 60, organizationId: organization.id },
                { weekDay: 5, startTime: 9 * 60, endTime: 15 * 60, organizationId: organization.id },
              ],
            },
          },
        },
      });

      // 2. Create two default delivery types linked to the default schedule
      await prisma.deliveryType.createMany({
        data: [
          {
            name: "Entrega Normal",
            slug: `entrega-normal-${organization.sigla}`,
            isVisible: true,
            organizationId: organization.id,
            scheduleId: defaultSchedule.id,
            duration: 90,
            lunchTimeStart: 12 * 60,
            lunchTimeEnd: 13 * 60,
          },
          {
            name: "Entrega Secreta",
            slug: `entrega-secreta-${organization.sigla}`,
            isVisible: false,
            organizationId: organization.id,
            scheduleId: defaultSchedule.id,
            duration: 60,
            lunchTimeStart: 12 * 60,
            lunchTimeEnd: 13 * 60,
          },
        ],
      });

      return organization;
    });

    return NextResponse.json(organization);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }

    console.error("[ORGANIZATIONS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
