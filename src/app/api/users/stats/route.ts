import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const orgId = session.user.organizationId;

    const [total, active, inactive] = await Promise.all([
      prisma.user.count({
        where: { deletedAt: null, organizationId: orgId },
      }),
      prisma.user.count({
        where: { isActive: true, deletedAt: null, organizationId: orgId },
      }),
      prisma.user.count({
        where: { isActive: false, deletedAt: null, organizationId: orgId },
      }),
    ]);

    return NextResponse.json({
      total,
      active,
      inactive,
    });
  } catch (error) {
    console.error("[USERS_STATS]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
