import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Chat } from "./chat";

export default async function ChatPage() {
  const session = await auth();

  if (!session) {
    return redirect("/entrar");
  }

  return (
    <div className=" flex flex-col h-[calc(100svh-80px-48px)] pt-12">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <Chat />
        </div>
        <div className="text-center py-2 text-xs text-gray-500">
          Nossa IA pode cometer erros. Por favor, verifique as respostas.
        </div>
      </div>
    </div>
  );
}
