"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Message } from "ai";
import { toast } from "sonner";

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const errorBody = await res.text();
    console.error("Fetch error:", errorBody);
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const useGetMessages = (chatId: string | null) => {
  return useQuery<Message[]>({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      if (!chatId) return [];
      const response = await fetcher<Message[]>(
        `/api/chat/messages?chatId=${chatId}`,
      );
      return response;
    },
    enabled: !!chatId,
  });
};

export const useSetMessages = (chatId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messages: Message[]) => {
      if (!chatId) throw new Error("chatId is required");
      return fetcher("/api/chat/save", {
        method: "POST",
        body: JSON.stringify({ chatId, messages }),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData(["messages", chatId], variables);
    },
    onError: (error) => {
      console.error("Failed to save messages:", error);
      toast.error("Failed to save messages.");
    },
  });
};

export const useClearMessages = (chatId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!chatId) throw new Error("chatId is required");
      return fetcher("/api/chat/save", {
        method: "POST",
        body: JSON.stringify({ chatId, messages: [] }),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.setQueryData(["messages", chatId], []);
      toast.success("Messages cleared!");
    },
    onError: (error) => {
      console.error("Failed to clear messages:", error);
      toast.error("Failed to clear messages.");
    },
  });
};

export const useSaveMessage = (chatId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: Message) => {
      if (!chatId) throw new Error("chatId is required");

      const currentMessages =
        queryClient.getQueryData<Message[]>(["messages", chatId]) ?? [];
      const updatedMessages = [...currentMessages, message];

      return fetcher("/api/chat/save", {
        method: "POST",
        body: JSON.stringify({ chatId, messages: updatedMessages }),
        headers: { "Content-Type": "application/json" },
      });
    },
    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({ queryKey: ["messages", chatId] });
      const previousMessages = queryClient.getQueryData<Message[]>([
        "messages",
        chatId,
      ]);
      queryClient.setQueryData(
        ["messages", chatId],
        (old: Message[] = []) => [...old, newMessage],
      );
      return { previousMessages };
    },
    onSuccess: (_, newMessage) => {
      // The optimistic update is already there, we might just need to confirm.
      // Or if the server returns the final message list, we can set it here.
      // For now, we'll just invalidate to be safe.
      queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
      // toast.success("Message saved!");
    },
    onError: (err, newMessage, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ["messages", chatId],
          context.previousMessages,
        );
      }
      toast.error("Failed to save message.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
    },
  });
};
