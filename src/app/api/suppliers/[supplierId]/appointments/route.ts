import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { supplierId: string } },
) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        supplierId: params.supplierId,
      },
      include: {
        deliveryType: true,
        organization: true,
        user: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("[SUPPLIER_APPOINTMENTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
