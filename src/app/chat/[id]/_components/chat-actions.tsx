"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";

interface ChatActionsProps {
  message: {
    content: string;
    role: "user" | "assistant" | "data";
  };
  className?: string;
}

export const ChatActions = ({ message, className }: ChatActionsProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const isUser = message.role === "user";

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
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {}}
              className="size-8 rounded-lg"
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {}}
              className="size-8 rounded-lg"
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
