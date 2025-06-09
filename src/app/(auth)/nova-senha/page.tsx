import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NovaSenhaForm } from "./_components/nova-senha-form";

export default async function NovaSenhaPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/entrar");
  }

  return <NovaSenhaForm email={session.user.email} />;
}
