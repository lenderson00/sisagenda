import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { notificationService } from "@/lib/services/notification-service";

const updateNotificationSchema = z.object({
  action: z.enum(["markAsRead", "markAsArchived"]),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action } = updateNotificationSchema.parse(body);
    const notificationId = params.id;

    let success = false;
    let actionName = "";

    if (action === "markAsRead") {
      success = await notificationService.markAsRead(
        notificationId,
        session.user.id
      );
      actionName = "read";
    } else if (action === "markAsArchived") {
      success = await notificationService.markAsArchived(
        notificationId,
        session.user.id
      );
      actionName = "archived";
    }

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update notification or notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Notification marked as ${actionName}`
    });
  } catch (error) {
    console.error("Failed to update notification:", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}
