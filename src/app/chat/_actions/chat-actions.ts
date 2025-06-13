"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const deleteChatSchema = z.object({
  chatId: z.string(),
});

export async function deleteChat(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return { error: "User not found" };
  }
  const userId = user.id;

  const validatedFields = deleteChatSchema.safeParse({
    chatId: formData.get("chatId"),
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { chatId } = validatedFields.data;

  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chat || chat.userId !== userId) {
      return { error: "Chat not found or access denied" };
    }

    await prisma.chat.delete({
      where: { id: chatId },
    });

    revalidatePath("/chat");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete chat" };
  }
}

const renameChatSchema = z.object({
  chatId: z.string(),
  title: z.string().min(1, "Title is required"),
});

export async function renameChat(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return { error: "User not found" };
  }

  const userId = user.id;

  const validatedFields = renameChatSchema.safeParse({
    chatId: formData.get("chatId"),
    title: formData.get("title"),
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { chatId, title } = validatedFields.data;

  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId, userId },
    });

    if (!chat || chat.userId !== userId) {
      return { error: "Chat not found or access denied" };
    }

    await prisma.chat.update({
      where: { id: chatId },
      data: { title },
    });

    revalidatePath("/chat");
    revalidatePath(`/chat/${chatId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to rename chat" };
  }
}
