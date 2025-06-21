import { useCallback, useState } from "react";

export function useChatDraft(chatId?: string | null | undefined) {
  const storageKey = chatId ? `chat-draft-${chatId}` : "chat-draft-new";

  const [draftValue, setDraftValueState] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(storageKey) || "";
  });

  const setDraftValue = useCallback(
    (value: string) => {
      setDraftValueState(value);

      if (typeof window !== "undefined") {
        if (value) {
          localStorage.setItem(storageKey, value);
        } else {
          localStorage.removeItem(storageKey);
        }
      }
    },
    [storageKey],
  );

  const setDraftValueWithChatId = useCallback(
    (chatId: string, value: string) => {
      setDraftValue(value);
      localStorage.setItem(`chat-draft-${chatId}`, value);
    },
    [setDraftValue],
  );

  const clearDraft = useCallback(() => {
    setDraftValueState("");
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  return {
    draftValue,
    setDraftValue,
    setDraftValueWithChatId,
    clearDraft,
  };
}
