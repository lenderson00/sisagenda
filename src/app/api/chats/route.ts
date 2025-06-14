import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import z from "zod";

export const GET = async (request: NextRequest) => {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const searchParams = request.nextUrl.searchParams;
  const cursor = searchParams.get("cursor");
  const limit = Number(searchParams.get("limit")) || 10;

  const chats = await prisma.chat.findMany({
    where: {
      userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: limit + 1,
    ...(cursor
      ? {
          cursor: {
            id: cursor,
          },
          skip: 1,
        }
      : {}),
  });

  const hasNextPage = chats.length > limit;
  const items = hasNextPage ? chats.slice(0, -1) : chats;
  const nextCursor = hasNextPage ? items[items.length - 1].id : null;

  return NextResponse.json({
    items,
    nextCursor,
    hasNextPage,
  });
};

const createChatSchema = z.object({
  title: z.string().min(1),
});

export const POST = async (request: NextRequest) => {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const userId = user.id;

  const { title } = createChatSchema.parse(await request.json());

  let suggestedTitle = title;

  if (title != "Nova Conversa") {
    const response = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Sugira um título para uma conversa com o usuário sobre o título ${title}, com 2 palavras. Nao coloque " no titulo.`,
    });
    suggestedTitle = response.text;
  }

  const chat = await prisma.chat.create({
    data: {
      title: suggestedTitle,
      userId,
    },
  });

  return NextResponse.json(chat);
};
