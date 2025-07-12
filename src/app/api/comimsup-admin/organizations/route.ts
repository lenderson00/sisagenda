import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.organizationId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "COMRJ_ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const organizations = await prisma.organization.findMany({
      where: {
        id: {
          not: session.user.organizationId,
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(organizations);
  } catch (error) {
    console.error("[ORGANIZATIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
