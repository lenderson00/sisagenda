import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const MAX_MESSAGES_PER_CHAT = 30;

export async function POST(request: NextRequest) {
  try {
    const { message, chatId } = await request.json();

    if (!chatId || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const existingMessage = await prisma.message.findUnique({
      where: { id: message.id },
    });

    if (!existingMessage) {
      const messageCount = await prisma.message.count({
        where: { chatId },
      });

      if (messageCount >= MAX_MESSAGES_PER_CHAT) {
        return NextResponse.json(
          {
            error: "Chat message limit reached",
            description: `This chat has reached its message limit of ${MAX_MESSAGES_PER_CHAT}.`,
          },
          { status: 403 },
        );
      }
    }

    const result = await prisma.message.upsert({
      where: { id: message.id },
      update: {
        role: message.role,
        content: message.content,
        toolInvocations: message.parts ?? undefined,
      },
      create: {
        id: message.id,
        role: message.role,
        content: message.content,
        toolInvocations: message.parts ?? undefined,
        chatId,
      },
    });

    return NextResponse.json({
      success: true,
      saved: result !== null,
      messageId: message.id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
