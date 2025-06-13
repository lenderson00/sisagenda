import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const GET = async (request: NextRequest) => {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
  }

  const messages = await prisma.message.findMany({
    where: {
      chatId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return NextResponse.json(
    messages.map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content,
      toolInvocations: message.toolInvocations
        ? JSON.parse(message.toolInvocations as string)
        : null,
    })),
  );
};
