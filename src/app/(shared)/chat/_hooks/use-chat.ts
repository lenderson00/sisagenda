import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteChat, renameChat } from "../_actions/chat-actions";

type Chat = {
  id: string;
  title: string | null;
  updatedAt: Date;
};

type ChatResponse = {
  items: Chat[];
  nextCursor: string | null;
  hasNextPage: boolean;
};

const getChatList = async ({
  pageParam = null,
}: {
  pageParam: string | null;
}) => {
  const response = await fetch(`/api/chats?cursor=${pageParam || ""}`);
  return (await response.json()) as ChatResponse;
};

export const useChatList = () => {
  return useInfiniteQuery({
    queryKey: ["chats"],
    queryFn: getChatList,
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};

export const useDeleteChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (chatId: string) => {
      const formData = new FormData();
      formData.append("chatId", chatId);
      return deleteChat(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};

export const useRenameChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      chatId,
      title,
    }: {
      chatId: string;
      title: string;
    }) => {
      const formData = new FormData();
      formData.append("chatId", chatId);
      formData.append("title", title);
      return renameChat(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};
