import { useMutation, useQueryClient } from "@tanstack/react-query";

const createNewChat = async () => {
  const response = await fetch("/api/chats", {
    method: "POST",
    body: JSON.stringify({
      title: "Nova Conversa",
    }),
  });
  return response.json();
};

export const useCreateChat = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNewChat,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["chats", userId] });
    },
  });
};
