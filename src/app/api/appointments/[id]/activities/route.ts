import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const activities = await prisma.appointmentActivity.findMany({
      where: {
        appointmentId: id,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { type, content } = body;

    // Validate required fields
    if (!type || !content) {
      return NextResponse.json(
        { error: "Type and content are required" },
        { status: 400 },
      );
    }

    // Validate user ID exists
    if (!session.user.id) {
      console.error("Session user ID is missing:", session.user);
      return NextResponse.json(
        { error: "User ID is missing from session" },
        { status: 400 },
      );
    }

    // Verify appointment exists
    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    console.log("Creating activity with data:", {
      type,
      title: type === "COMMENT" ? "Comentário" : type,
      content,
      appointmentId: id,
      userId: session.user.id,
    });

    const activity = await prisma.appointmentActivity.create({
      data: {
        type: type,
        title: type === "COMMENT" ? "Comentário" : type,
        content: content,
        appointmentId: id,
        userId: session.user.id,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(activity);
  } catch (error) {
    console.error("Failed to create activity:", error);
    return NextResponse.json(
      { error: "Failed to create activity" },
      { status: 500 },
    );
  }
}
