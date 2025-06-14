"use client";

import { useRouterStuff } from "@/hooks/use-router-stuffs";
import { useChat } from "@ai-sdk/react";
import { IconPoint, IconPointFilled } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChatInput } from "../_components/chat-input";
import {
  ChatContainerContent,
  ChatContainerRoot,
} from "./_components/chat-container";
import { ChatMessage } from "./_components/chat-message";
import { ScrollButton } from "./_components/scroll-button";
import { useMessageLoader } from "./_hooks/use-message-loader";
import { useMessagePersistence } from "./_hooks/use-message-persistence";

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const chatId = params?.id as string;
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
    error,
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
      if (input.trim()) {
        handleSubmit(e);
      }
    },
    [input, handleSubmit],
  );

  // Memoize the input change handler
  const handleInputChangeWrapper = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      handleInputChange(event);
    },
    [handleInputChange],
  );

  // Memoize the chat container content
  const chatContent = useMemo(
    () => (
      <ChatContainerContent
        className="flex w-full flex-col pt-20 pb-4 max-w-2xl mx-auto"
        style={{
          scrollbarGutter: "stable both-edges",
          scrollbarWidth: "none",
        }}
      >
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg as any} status={status} />
        ))}

        {status === "submitted" &&
          messages.length > 0 &&
          messages[messages.length - 1].role === "user" && (
            <div className="h-10 ">
              <IconPointFilled className="size-10 motion-preset-pulse-md  text-neutral-400" />
            </div>
          )}

        <div className="absolute bottom-0 flex w-full max-w-3xl flex-1 items-end justify-end gap-4 px-6 pb-2">
          <ScrollButton className="absolute top-[-50px] right-[500px]" />
        </div>
      </ChatContainerContent>
    ),
    [messages, status],
  );

  if (!chatId) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <div className="flex h-[calc(100svh-72px-64px)] w-full flex-col bg-white no-scrollbar">
        <ChatContainerRoot className="relative w-full no-scrollbar">
          {chatContent}
        </ChatContainerRoot>

        <div className="px-4 pb-4">
          <div className="mx-auto max-w-4xl">
            <form onSubmit={handleFormSubmit}>
              <ChatInput
                stop={() => {}}
                input={input}
                setInput={handleInputChangeWrapper}
                isLoading={isLoading}
                messages={messages}
                append={append}
                handleSubmit={handleSubmit}
              />
            </form>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
