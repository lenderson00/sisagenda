import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const { password } = await req.json();
  if (!password || password.length < 8) {
    return NextResponse.json({ error: "Invalid password" }, { status: 400 });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { email: session.user.email },
    data: { password: hashedPassword, mustChangePassword: false },
  });

  // Sign out to force a new session with updated data
  await signOut();

  return NextResponse.json({ success: true });
}
