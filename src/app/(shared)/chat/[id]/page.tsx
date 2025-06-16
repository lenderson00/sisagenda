import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PageClient } from "./page-client";

interface ChatPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;

  const chat = await prisma.chat.findUnique({
    where: {
      id,
    },
  });

  if (!chat) {
    return notFound();
  }

  return <PageClient chatId={id} />;
}
