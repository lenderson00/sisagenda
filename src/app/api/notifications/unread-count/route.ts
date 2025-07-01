import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { notificationService } from "@/lib/services/notification-service";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const count = await notificationService.getUnreadCount(session.user.id);

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Failed to fetch unread count:", error);
    return NextResponse.json(
      { error: "Failed to fetch unread count" },
      { status: 500 },
    );
  }
}
