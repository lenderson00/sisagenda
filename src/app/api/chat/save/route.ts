import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import type { Message } from "ai";

const MAX_MESSAGES_PER_CHAT = 30;

export async function POST(request: NextRequest) {
  try {
    const { messages, chatId } = await request.json();

    if (!chatId || !messages) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const existingMessages = await prisma.message.findMany({
      where: { chatId },
    });

    if (existingMessages.length > 0) {
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

    const persistedMessages = await prisma.message.findMany({
      where: { chatId },
    });

    console.log("messages", messages);

    const messagesToSave = messages.map((message: Message) => ({
      id: message.id,
      chatId,
      content: message.content,
      role: message.role,
      parts: message.parts,
    })).filter((message: Message) => !persistedMessages.some((m) => m.id === message.id));

    console.log("messagesToSave", messagesToSave);
    const result = await prisma.message.createMany({
      data: messagesToSave,
    });


    return NextResponse.json({ success: true, saved: result !== null });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
