import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const session = await auth();

  if (!session) {
    return redirect("/entrar");
  }

  return (
    <div className="bg-neutral-100 h-screen">{JSON.stringify(session)}</div>
  );
}
