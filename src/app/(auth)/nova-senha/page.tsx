import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NovaSenhaForm } from "./_components/nova-senha-form";

export default async function NovaSenhaPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/entrar");
  }

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-4">Defina uma nova senha</h1>
        <NovaSenhaForm email={session.user.email} />
      </div>
    </div>
  );
}
