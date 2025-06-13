import { useMutation, useQueryClient } from "@tanstack/react-query";

const createNewChat = async (input?: string) => {
  const response = await fetch("/api/chats", {
    method: "POST",
    body: JSON.stringify({
      title: input || "Nova Conversa",
    }),
  });
  return response.json();
};

export const useCreateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ input }: { input?: string }) => createNewChat(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};
