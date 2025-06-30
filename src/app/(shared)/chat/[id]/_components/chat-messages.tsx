import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Message } from "ai";
import { motion } from "framer-motion";
import { Bot, Hammer, Loader2, User } from "lucide-react";
import { memo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { ChatActions } from "./chat-actions";
import { ToolCall } from "./chat-tool-message";

interface ChatMessage extends Message {
  id: string;
  role: "user" | "assistant" | "data";
  content: string;
  parts?: any[];
}

export type ChatStatus = "submitted" | "streaming" | "ready" | "error";

interface ChatMessageProps {
  message: ChatMessage;
  status: ChatStatus;
  isLastMessage?: boolean;
}

export const ChatMessage = memo(
  ({ message, status, isLastMessage = false }: ChatMessageProps) => {
    const isUser = message.role === "user";
    const [isHovered, setIsHovered] = useState(false);

    const isStreaming =
      status === "streaming" && message.role === "assistant" && isLastMessage;

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
                    "p-2 rounded-lg [&>p]:m-0 w-full prose prose-sm max-w-2xl",
                    isUser
                      ? "bg-muted px-4 max-w-md text-foreground"
                      : "bg-transparent dark:text-white",
                  )}
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
                {!isStreaming && (
                  <ChatActions
                    message={message}
                    className={cn(
                      "opacity-100 transition-opacity duration-200 h-10",
                      isUser ? !isHovered && "opacity-0" : "opacity-100",
                    )}
                  />
                )}
              </div>
            </div>
          ) : null}
        </div>
      </motion.div>
    );
  },
);
ChatMessage.displayName = "ChatMessage";
