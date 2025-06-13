"use client";

import { useEffect, useState } from "react";
import { ChatInput } from "./_components/chat-input";
import { useCreateChat } from "./_hooks/use-create-chat";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";

type Props = {
  userId: string;
  userName: string;
};

export const Chat = ({ userName, userId }: Props) => {
  const [input, setInput] = useState("");
  const router = useRouter();
  const { mutate: createChat, isPending, data: chat } = useCreateChat();
  const [isLoading, setIsLoading] = useState(false);

  const createNewChat = async (input: string) => {
    setIsLoading(true);
    toast.loading("Criando nova conversa...");
    createChat({ input });
  };

  useEffect(() => {
    if (chat) {
      router.push(`/chat/${chat.id}`);
      setIsLoading(false);
      toast.dismiss();
    }
  }, [chat]);

  return (
    <div className="flex flex-col justify-center items-center flex-1 h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="text-3xl font-bold mb-4 text-center">
          {userName && `Olá ${userName},`} {userName ? "n" : "N"}o que posso
          ajudar?
        </div>
      </motion.div>
      <ChatInput
        stop={() => {}}
        input={input}
        setInput={(v) => setInput(v.target.value)}
        isLoading={isPending}
        isCreating={isLoading}
        messages={[]}
        append={async (message, chatRequestOptions) => {
          return "";
        }}
        handleSubmit={() => {}}
        createNewChat={createNewChat}
      />
    </div>
  );
};
