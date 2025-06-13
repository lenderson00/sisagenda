import { useCallback, useState } from "react";

export const useMessageLoader = (chatId: string) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const loadMessages = useCallback(async () => {
    const response = await fetch(`/api/chat/messages?chatId=${chatId}`);
    const data = await response.json();

    setIsLoaded(true);
    return data.map((msg: any) => {
      const dbData = msg.toolInvocations; // This field stores either `parts` or old `toolInvocations`
      let parts: any[] | undefined = undefined;

      if (Array.isArray(dbData)) {
        // Heuristic: Check if it's the new `parts` structure or the old `toolInvocations` array.
        // The new structure has objects with a `type` property.
        if (dbData.length > 0 && dbData[0].type) {
          parts = dbData; // It's the new format, use as is.
        } else {
          // It's the old format, normalize it to the `parts` structure.
          parts = dbData.map((ti: any) => ({
            type: "tool-invocation",
            toolInvocation: ti,
          }));
        }
      }

      return {
        id: msg.id,
        role: msg.role as "user" | "assistant" | "data",
        content: msg.content,
        parts: parts, // Pass the correctly structured parts
      };
    });
  }, [chatId, isLoaded]);

  return { isLoaded, loadMessages };
};
