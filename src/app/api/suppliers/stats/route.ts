import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const [total, active, inactive] = await Promise.all([
      prisma.supplier.count({
        where: {
          deletedAt: null,
        },
      }),
      prisma.supplier.count({
        where: {
          isActive: true,
          deletedAt: null,
        },
      }),
      prisma.supplier.count({
        where: {
          isActive: false,
          deletedAt: null,
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
