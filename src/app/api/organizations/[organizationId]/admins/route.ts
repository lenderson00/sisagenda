import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ organizationId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is super admin
    if (session.user.role !== "SUPER_ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { organizationId } = await params;

    const admins = await prisma.user.findMany({
      where: {
        organizationId: organizationId,
        role: {
          in: ["ADMIN", "COMIMSUP_ADMIN", "COMRJ_ADMIN"],
        },
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log(admins);

    return NextResponse.json(admins);
  } catch (error) {
    console.error("[ADMINS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
