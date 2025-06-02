import { randomBytes } from "node:crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const tempPassword = randomBytes(4).toString("hex");
    const hashedPassword = await hash(tempPassword, 12);

    const { userId } = await params;

    await prisma.user.update({
      where: { id: userId },
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
