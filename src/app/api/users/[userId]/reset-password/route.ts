import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { randomBytes } from "crypto";
import { hash } from "bcryptjs";

export async function POST(
  request: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const tempPassword = randomBytes(4).toString("hex");
    const hashedPassword = await hash(tempPassword, 12);

    await prisma.user.update({
      where: { id: params.userId },
      data: {
        password: hashedPassword,
        mustChangePassword: true,
      },
    });

    return NextResponse.json({ tempPassword });
  } catch (error) {
    console.error("[USER_RESET_PASSWORD]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
