import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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
