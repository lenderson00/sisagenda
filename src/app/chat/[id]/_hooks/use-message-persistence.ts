import type { Message } from "ai";
import { useCallback, useState } from "react";

export const useMessagePersistence = (chatId: string) => {
  const [savedMessageIds, setSavedMessageIds] = useState<Set<string>>(
    new Set(),
  );

  const saveMessage = useCallback(
    async (message: Message) => {
      if (!message.id || savedMessageIds.has(message.id)) {
        return false;
      }

      try {
        const response = await fetch("/api/chat/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chatId, message }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setSavedMessageIds((prev) => new Set(prev).add(message.id));
          return true;
        } else {
          console.error("Failed to save message:", result.error);
          return false;
        }
      } catch (error) {
        console.error("Failed to save message:", error);
        return false;
      }
    },
    [chatId, savedMessageIds],
  );

  const markAsSaved = useCallback((messageIds: string[]) => {
    setSavedMessageIds((prev) => {
      const newSet = new Set(prev);
      messageIds.forEach((id) => newSet.add(id));
      return newSet;
    });
  }, []);

  return { saveMessage, markAsSaved, savedMessageIds };
};
