"use client";

import { CreateMessage, type Message, useChat } from "@ai-sdk/react";
import { AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { ChatContainerRoot } from "./_components/chat-container";
import { ChatForm } from "./_components/chat-form";
import { MessageList } from "./_components/message-list";
import { useMessages } from "./_context/message";
import { useChatDraft } from "./_hooks/use-chat-draft";

const MAX_MESSAGES_PER_CHAT = 30;

interface PageClientProps {
  chatId: string;
}

interface ChatViewProps {
  chatId: string;
  initialMessages: Message[];
}

function ChatView({
  chatId,
  initialMessages: initialMessagesFromProps,
}: ChatViewProps) {
  const { draftValue, clearDraft } = useChatDraft(chatId);
  const { saveAllMessages } = useMessages();
  const didAppendDraft = useRef(false);

  const { messages, input, handleInputChange, handleSubmit, append, status } =
    useChat({
      id: chatId,
      api: "/api/chat",
      maxSteps: 5,
      initialMessages: initialMessagesFromProps,
      onFinish: async (message) => {
        const allMessages = [...messages, message];
        saveAllMessages(allMessages);
        if (draftValue) {
          clearDraft();
        }
      },
      onError: (error) => {
        console.error("Chat error:", error);
        toast.error("Ocorreu um erro na sua solicitação.");
      },
    });

  useEffect(() => {
    if (
      draftValue &&
      initialMessagesFromProps.length === 0 &&
      !didAppendDraft.current
    ) {
      const messageDraft: Message = {
        role: "user",
        content: draftValue,
        id: crypto.randomUUID(),
      };
      append(messageDraft);
      saveAllMessages([messageDraft]);
      didAppendDraft.current = true;
    }
  }, [append, draftValue, initialMessagesFromProps.length, saveAllMessages]);

  const isLoading = status === "streaming" || status === "submitted";

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (messages.length >= MAX_MESSAGES_PER_CHAT) {
        toast.error("Chat message limit reached, inicie outra conversa");
        return;
      }

      if (input.trim()) {
        handleSubmit(e);
      }
    },
    [input, handleSubmit, messages],
  );

  const handleInputChangeWrapper = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      handleInputChange(event);
    },
    [handleInputChange],
  );

  console.log("messages", messages);

  return (
    <AnimatePresence mode="wait">
      <div className="flex h-[calc(100svh-72px-64px)] w-full flex-col bg-white">
        <ChatContainerRoot className="relative w-full no-scrollbar h-full flex-1">
          <MessageList messages={messages} status={status} />
        </ChatContainerRoot>
        <ChatForm
          handleFormSubmit={handleFormSubmit}
          input={input}
          handleInputChangeWrapper={handleInputChangeWrapper}
          isLoading={isLoading}
          messages={messages}
          append={append}
          handleSubmit={handleSubmit}
          isSubmitDisabled={messages.length >= MAX_MESSAGES_PER_CHAT}
        />
      </div>
    </AnimatePresence>
  );
}

export function PageClient({ chatId }: PageClientProps) {
  const { messages: initialMessages, isLoading } = useMessages();

  if (isLoading || !chatId) {
    return (
      <div className="flex h-[calc(100svh-72px-64px)] w-full flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!chatId) {
    return null;
  }

  return <ChatView chatId={chatId} initialMessages={initialMessages} />;
}
