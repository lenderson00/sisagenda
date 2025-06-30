import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const sendTokenSchema = z.object({
  whatsapp: z.string().min(10, "Invalid WhatsApp number"),
});

// Mock function to generate a 4-digit token
const generateMockToken = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const validatedData = sendTokenSchema.parse(body);

    const token = generateMockToken();
    const expires = new Date(new Date().getTime() + 15 * 60 * 1000); // 15 minutes

    // Store the token and the new WhatsApp number
    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: { whatsapp: validatedData.whatsapp, whatsappVerified: false },
      }),
      prisma.whatsappVerificationToken.upsert({
        where: { userId: session.user.id },
        update: { token, expires },
        create: {
          userId: session.user.id,
          token,
          expires,
        },
      }),
    ]);

    // In a real implementation, you would send the token via WhatsApp here.
    // For now, we'll just return a success message.
    // We could also return the token in development for easier testing.
    return NextResponse.json({
      message: "Verification code sent.",
      // In development, you might want to return the token for easy testing.
      ...(process.env.NODE_ENV === "development" && { token }),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }

    console.error("[WHATSAPP_SEND_TOKEN_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
