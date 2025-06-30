import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const verifyTokenSchema = z.object({
  token: z.string().length(4, "Invalid code"),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const validatedData = verifyTokenSchema.parse(body);

    const verificationToken = await prisma.whatsappVerificationToken.findUnique({
      where: { userId: session.user.id, token: validatedData.token },
    });

    if (!verificationToken) {
      return new NextResponse("Invalid verification code.", { status: 400 });
    }

    if (verificationToken.expires < new Date()) {
      return new NextResponse("Verification code has expired.", {
        status: 400,
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { whatsappVerified: true },
    });

    await prisma.whatsappVerificationToken.delete({
      where: { id: verificationToken.id },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }

    console.error("[WHATSAPP_VERIFY_TOKEN_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
