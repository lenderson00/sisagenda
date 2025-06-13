import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { memo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { User, Bot, Hammer } from "lucide-react";
import { Message } from "ai";
import { ToolCall } from "./chat-tool-message";
import { cn } from "@/lib/utils";
import { ChatActions } from "./chat-actions";

interface ChatMessage extends Message {
  id: string;
  role: "user" | "assistant" | "data";
  content: string;
  parts?: any[];
}

export const ChatMessage = memo(({ message }: { message: ChatMessage }) => {
  const isUser = message.role === "user";
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-3 py-2 relative"
    >
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
          <div
            className={cn(
              "w-full flex",
              isUser ? "justify-end" : "justify-start",
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className={cn(
                "flex flex-col",
                isUser ? "items-end" : "items-start",
              )}
            >
              <div
                className={cn(
                  "prose prose-sm prose-invert flex",
                  isUser ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "p-2 w-fit rounded-lg",
                    isUser ? "bg-neutral-100 px-4 max-w-md" : "bg-transparent",
                  )}
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
              <ChatActions
                message={message}
                className={cn(
                  "opacity-100 transition-opacity duration-200",
                  isUser ? isHovered && "opacity-0" : "opacity-100",
                )}
              />
            </div>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
});
ChatMessage.displayName = "ChatMessage";
