"use client";

import { useRouterStuff } from "@/hooks/use-router-stuffs";
import { useChat } from "@ai-sdk/react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useMessageLoader } from "../_hooks/use-message-loader";
import { useMessagePersistence } from "../_hooks/use-message-persistence";
import { ChatContainerRoot } from "./chat-container";
import { ChatForm } from "./chat-form";
import { MessageList } from "./message-list";

const MAX_MESSAGES_PER_CHAT = 30;

interface PageClientProps {
  chatId: string;
}

export function PageClient({ chatId }: PageClientProps) {
  const router = useRouter();
  const { searchParams } = useRouterStuff();
  const [promptProcessed, setPromptProcessed] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const { saveMessage, markAsSaved, savedMessageIds } =
    useMessagePersistence(chatId);
  const { loadMessages, isLoaded } = useMessageLoader(chatId);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    setMessages,
    status,
  } = useChat({
    id: chatId,
    api: "/api/chat",
    initialMessages: [],
    maxSteps: 5,
    onError: (error) => {
      console.error("Chat error:", error);
    },
  });

  // Memoize the prompt handling logic
  const handlePrompt = useCallback(async () => {
    const prompt = searchParams.get("prompt");
    if (prompt && !promptProcessed && isInitialized) {
      await append({
        id: "initial-prompt",
        role: "user",
        content: prompt,
      });
      setPromptProcessed(true);
      router.replace(`/chat/${chatId}`, { scroll: false });
    }
  }, [searchParams, promptProcessed, append, router, chatId, isInitialized]);

  useEffect(() => {
    handlePrompt();
  }, [handlePrompt]);

  // Memoize the chat initialization logic
  const initializeChat = useCallback(async () => {
    if (!chatId) {
      router.push("/chat");
      return;
    }

    if (!isInitialized) {
      const loadedMessages = await loadMessages();
      if (loadedMessages.length > 0) {
        setMessages(loadedMessages);
        markAsSaved(loadedMessages.map((msg: any) => msg.id));
      }
      setIsInitialized(true);
    }
  }, [chatId, router, isInitialized, loadMessages, setMessages, markAsSaved]);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  const isLoading = status === "streaming";

  // Memoize the message saving logic
  const saveMessages = useCallback(() => {
    if (!isLoaded || !isInitialized) return;

    messages.forEach((msg, index) => {
      const isLastAssistantMessage =
        msg.role === "assistant" && index === messages.length - 1;
      const isStreaming = isLoading && isLastAssistantMessage;

      if (!savedMessageIds.has(msg.id) && !isStreaming) {
        saveMessage(msg);
      }
    });
  }, [
    messages,
    savedMessageIds,
    saveMessage,
    isLoaded,
    isInitialized,
    isLoading,
  ]);

  useEffect(() => {
    saveMessages();
  }, [saveMessages]);

  // Memoize the form submission handler
  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (messages.length >= MAX_MESSAGES_PER_CHAT) {
        // TODO: show a toast notification
        console.error("Chat message limit reached");
        return;
      }

      if (input.trim()) {
        handleSubmit(e);
      }
    },
    [input, handleSubmit, messages],
  );

  // Memoize the input change handler
  const handleInputChangeWrapper = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      handleInputChange(event);
    },
    [handleInputChange],
  );

  if (!chatId) {
    return null;
  }

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
