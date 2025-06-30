import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { notificationService } from "@/lib/services/notification-service";

const querySchema = z.object({
  page: z.string().optional().transform((val) => (val ? Number.parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? Number.parseInt(val, 10) : 20)),
  status: z.enum(["UNREAD", "READ", "ARCHIVED"]).optional().nullable(),
  type: z.string().optional().nullable(),
});

const markAllAsReadSchema = z.object({
  action: z.literal("markAllAsRead"),
});

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const query = querySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      status: searchParams.get("status"),
      type: searchParams.get("type"),
    });

    const sanitizedQuery = {
      ...query,
      status: query.status ?? undefined,
      type: query.type ?? undefined,
    };

    const result = await notificationService.getUserNotifications(
      session.user.id,
      sanitizedQuery
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action } = markAllAsReadSchema.parse(body);

    if (action === "markAllAsRead") {
      const count = await notificationService.markAllAsRead(session.user.id);
      return NextResponse.json({
        success: true,
        message: `${count} notifications marked as read`
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Failed to update notifications:", error);
    return NextResponse.json(
      { error: "Failed to update notifications" },
      { status: 500 }
    );
  }
}
