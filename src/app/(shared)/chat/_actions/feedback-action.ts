"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { MessageFeedbackType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const feedbackAction = async (
  messageId: string,
  type: MessageFeedbackType,
) => {
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

  // IMPORTANT: For this to work correctly and prevent duplicate feedback,
  // you should add a unique constraint to the MessageFeedback model in your `schema.prisma` file.
  // model MessageFeedback {
  //   ...
  //   @@unique([userId, messageId])
  // }
  // Then, run `npx prisma migrate dev --name add-unique-feedback` to apply it.

  const existingFeedback = await prisma.messageFeedback.findUnique({
    where: {
      userId_messageId: {
        userId,
        messageId,
      },
    },
  });

  console.log(existingFeedback);

  if (existingFeedback) {
    if (existingFeedback.type === type) {
      // User clicked the same button again, so remove feedback
      await prisma.messageFeedback.delete({
        where: { id: existingFeedback.id },
      });
    } else {
      // User changed their feedback
      await prisma.messageFeedback.update({
        where: { id: existingFeedback.id },
        data: { type },
      });
    }
  } else {
    // No feedback exists, so create it
    await prisma.messageFeedback.create({
      data: {
        messageId,
        userId,
        type,
      },
    });
  }

  revalidatePath("/chat");

  return { success: true };
};
