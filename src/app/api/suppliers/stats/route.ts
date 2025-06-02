import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get("organizationId");

    if (!organizationId) {
      return new NextResponse("Organization ID is required", { status: 400 });
    }

    const [total, active, inactive] = await Promise.all([
      prisma.user.count({
        where: {
          organizationId,
          role: "FORNECEDOR",
        },
      }),
      prisma.user.count({
        where: {
          organizationId,
          role: "FORNECEDOR",
          isActive: true,
        },
      }),
      prisma.user.count({
        where: {
          organizationId,
          role: "FORNECEDOR",
          isActive: false,
        },
      }),
    ]);

    return NextResponse.json({
      total,
      active,
      inactive,
    });
  } catch (error) {
    console.error("[SUPPLIERS_STATS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
