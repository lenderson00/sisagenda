import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { memo } from "react";
import ReactMarkdown from "react-markdown";
import { User, Bot, Hammer } from "lucide-react";
import { Message } from "ai";
import { ToolCall } from "./chat-tool-message";

interface ChatMessage extends Message {
  id: string;
  role: "user" | "assistant" | "data";
  content: string;
  parts?: any[];
}

export const ChatMessage = memo(({ message }: { message: ChatMessage }) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-3 p-2"
    >
      <Avatar className="h-8 w-8 shrink-0 self-start">
        <AvatarFallback>
          {isUser ? (
            <User size={18} />
          ) : message.role === "assistant" ? (
            <Bot size={18} />
          ) : (
            <Hammer size={18} />
          )}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 pt-1 text-sm space-y-2">
        {/* Render tool invocation parts first, as they happen before the final content */}
        {message.parts?.map((part, index) => {
          if (part.type === "tool-invocation") {
            return (
              <ToolCall
                key={part.toolInvocation.toolCallId ?? index}
                toolInvocation={part.toolInvocation}
              />
            );
          }

          return null;
        })}

        {/* Render aggregated text content. `useChat` streams text parts into this. */}
        {message.content ? (
          <ReactMarkdown>{message.content}</ReactMarkdown>
        ) : null}
      </div>
    </motion.div>
  );
});
ChatMessage.displayName = "ChatMessage";
