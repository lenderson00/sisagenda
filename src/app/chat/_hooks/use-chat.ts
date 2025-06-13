import { useInfiniteQuery } from "@tanstack/react-query";

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
