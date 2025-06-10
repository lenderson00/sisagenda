import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { NovaSenhaForm } from "./_components/nova-senha-form";

export default async function NovaSenhaPage() {
  const session = await auth();

  if (!session?.user?.email) {
    notFound();
  }

  return <NovaSenhaForm email={session.user.email} />;
}
