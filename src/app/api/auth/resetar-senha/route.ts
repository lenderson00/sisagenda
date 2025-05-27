import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import { NextResponse } from "next/server";
import { SisAgendaResetPasswordEmail } from "../../../../../emails/reset-password";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    // Generate a token
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expires,
      },
    });
    // Build reset link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || "http://localhost:3000";
    const resetPasswordLink = `${baseUrl}/resetar-senha?token=${token}`;
    // Send email (implement sendEmail for your provider)
    const { data, error } = await sendEmail(user.email, "Redefinição de senha - SisAgenda", SisAgendaResetPasswordEmail({
      userFirstname: user.name || user.email,
      resetPasswordLink,
    }));

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Erro ao enviar email" }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }
  // Always return success for security
  return NextResponse.json({ success: true });
}