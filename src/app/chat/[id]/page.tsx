"use client";

import { useRouterStuff } from "@/hooks/use-router-stuffs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useMessageLoader } from "./_hooks/use-message-loader";
import { useMessagePersistence } from "./_hooks/use-message-persistence";
import { useChat } from "@ai-sdk/react";
import { ChatInput } from "../_components/chat-input";
import { ChatMessage } from "./_components/chat-message";
import { AnimatePresence } from "framer-motion";

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const chatId = params?.id as string;
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { searchParams } = useRouterStuff();

  // State to prevent infinite loops
  const [promptProcessed, setPromptProcessed] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Custom hooks following separation of concerns
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
    isLoading,
    setMessages,
  } = useChat({
    id: chatId,
    api: "/api/chat",
    initialMessages: [],
    maxSteps: 5,
    onError: (error) => {
      console.error("Chat error:", error);
    },
  });

  useEffect(() => {
    const prompt = searchParams.get("prompt");
    if (prompt && !promptProcessed && isInitialized) {
      append({
        id: "initial-prompt",
        role: "user",
        content: prompt,
      });
      setPromptProcessed(true);

      // Clean the URL by removing the prompt query parameter
      router.replace(`/chat/${chatId}`, { scroll: false });
    }
  }, [
    searchParams,
    promptProcessed,
    append,
    router,
    chatId,
    setPromptProcessed,
    isInitialized,
  ]);

  useEffect(() => {
    if (!chatId) {
      router.push("/chat");
      return;
    }

    if (!isInitialized) {
      const initializeChat = async () => {
        const loadedMessages = await loadMessages();
        if (loadedMessages.length > 0) {
          setMessages(loadedMessages);
          // Mark all loaded messages as saved to prevent re-saving
          markAsSaved(loadedMessages.map((msg: any) => msg.id));
        }
        setIsInitialized(true);
      };

      initializeChat();
    }
  }, [chatId, router, isInitialized, loadMessages, setMessages, markAsSaved]);

  // Save new messages as they are added, handling streaming
  useEffect(() => {
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

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!chatId) {
    return null;
  }
  return (
    <div className="flex h-[calc(100svh-72px-64px)] w-full flex-col bg-white no-scrollbar">
      <div
        ref={chatContainerRef}
        className="no-scrollbar flex-1 pb-16 space-y-2 overflow-y-auto overflow-x-visible p-4 max-w-2xl w-full mx-auto"
      >
        <AnimatePresence mode="wait">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg as any} />
          ))}
        </AnimatePresence>
      </div>

      {error && (
        <div className="p-4 text-red-500 border-t bg-red-50 dark:bg-red-900/20">
          <p className="font-semibold">Ocorreu um erro:</p>
          <p>{error.message}</p>
          <p className="text-sm mt-2">{error.message}</p>
        </div>
      )}

      <div className="px-4 pb-4">
        <div className="mx-auto max-w-4xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim()) {
                handleSubmit(e);
              }
            }}
          >
            <ChatInput
              stop={() => {}}
              input={input}
              setInput={(value) => handleInputChange(value)}
              isLoading={isLoading}
              messages={messages}
              append={append}
              handleSubmit={handleSubmit}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
