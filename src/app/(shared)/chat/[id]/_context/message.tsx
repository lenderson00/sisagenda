"use client";

import { useQueryClient } from "@tanstack/react-query";
import type { Message as MessageAISDK } from "ai";
import { createContext, useContext, useEffect } from "react";
import {
  useClearMessages,
  useGetMessages,
  useSaveMessage,
  useSetMessages,
} from "../_hooks/use-chat-mutations";
import { useChatSession } from "./session";

interface MessagesContextType {
  messages: MessageAISDK[];
  isLoading: boolean;
  setMessages: (messages: MessageAISDK[]) => void;
  refresh: () => Promise<void>;
  saveAllMessages: (messages: MessageAISDK[]) => void;
  resetMessages: () => void;
  deleteMessages: () => void;
}

const MessagesContext = createContext<MessagesContextType | null>(null);

export function useMessages() {
  const context = useContext(MessagesContext);
  if (!context)
    throw new Error("useMessages must be used within MessagesProvider");
  return context;
}

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const { chatId } = useChatSession();
  const queryClient = useQueryClient();

  const { data: messages = [], refetch, isLoading } = useGetMessages(chatId);
  const setMessagesMutation = useSetMessages(chatId);
  const saveMessageMutation = useSaveMessage(chatId);
  const clearMessagesMutation = useClearMessages(chatId);

  useEffect(() => {
    if (chatId === null) {
      queryClient.setQueryData(["messages", null], []);
    }
  }, [chatId, queryClient]);

  const setMessages = (newMessages: MessageAISDK[]) => {
    queryClient.setQueryData(["messages", chatId], newMessages);
  };

  const refresh = async () => {
    await refetch();
  };

  const saveAllMessages = (newMessages: MessageAISDK[]) => {
    setMessagesMutation.mutate(newMessages);
  };

  const deleteMessages = () => {
    clearMessagesMutation.mutate();
  };

  const resetMessages = () => {
    queryClient.setQueryData(["messages", chatId], []);
  };

  return (
    <MessagesContext.Provider
      value={{
        messages,
        isLoading,
        setMessages,
        refresh,
        saveAllMessages,
        resetMessages,
        deleteMessages,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
}
