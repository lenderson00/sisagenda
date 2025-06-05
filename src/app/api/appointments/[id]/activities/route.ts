import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

    const activity = await prisma.appointmentActivity.create({
      data: {
        type: type,
        title: "Comentário",
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
