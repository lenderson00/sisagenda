"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MessageFeedbackType } from "@prisma/client";
import { motion } from "framer-motion";
import { Check, Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { feedbackAction } from "../../_actions/feedback-action";

interface ChatActionsProps {
  message: {
    id: string;
    content: string;
    role: "user" | "assistant" | "data";
  };
  className?: string;
}

export const ChatActions = ({ message, className }: ChatActionsProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [feedbackType, setFeedbackType] = useState<MessageFeedbackType | null>(
    null,
  );

  const isUser = message.role === "user";

  const handleFeedback = async (type: MessageFeedbackType) => {
    setFeedbackType((prev) => (prev === type ? null : type));
    await feedbackAction(message.id, type);
  };

  const onCopy = () => {
    if (isCopied) return;
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div
      className={cn(
        "flex items-center h-8 opacity-0 transition-opacity duration-200",
        isUser ? "justify-end" : "justify-start",
        className,
      )}
    >
      <div className="flex items-center space-x-1">
        {message.content && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCopy}
            className={cn(
              "size-8 rounded-lg",
              isUser && "hover:bg-transparent",
            )}
          >
            {isCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        )}
        {!isUser && message.content && (
          <motion.div
            className="flex items-center space-x-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleFeedback("THUMBS_UP")}
              disabled={
                feedbackType === "THUMBS_UP" || feedbackType === "THUMBS_DOWN"
              }
              className={cn(
                "size-8 rounded-lg",
                feedbackType === "THUMBS_DOWN" && "hidden",
              )}
            >
              <ThumbsUp
                className={cn(
                  "h-4 w-4",
                  feedbackType === "THUMBS_UP" && "fill-current",
                )}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={
                feedbackType === "THUMBS_UP" || feedbackType === "THUMBS_DOWN"
              }
              onClick={() => handleFeedback("THUMBS_DOWN")}
              className={cn(
                "size-8 rounded-lg",
                feedbackType === "THUMBS_UP" && "hidden",
              )}
            >
              <ThumbsDown
                className={cn(
                  "h-4 w-4",
                  feedbackType === "THUMBS_DOWN" && "fill-current",
                )}
              />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
