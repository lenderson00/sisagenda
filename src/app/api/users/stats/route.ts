import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const orgId = session.user.organizationId;

  if (!orgId) {
    return new NextResponse("Organization not found", { status: 404 });
  }

  try {
    const [total, active, inactive, suspended] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null, organizationId: orgId, role: { in: ["USER", "ADMIN"] } } }),
      prisma.user.count({
        where: { isActive: true, deletedAt: null, organizationId: orgId, role: { in: ["USER", "ADMIN"] } },
      }),
      prisma.user.count({
        where: { isActive: false, deletedAt: null, organizationId: orgId, role: { in: ["USER", "ADMIN"] } },
      }),
      prisma.user.count({
        where: { isActive: false, deletedAt: { not: null }, organizationId: orgId, role: { in: ["USER", "ADMIN"] } },
      }),
    ]);

    const stats = { total, active, inactive, suspended };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
