"use client";

import type { ChatRequestOptions, CreateMessage, Message } from "ai";
import { motion } from "framer-motion";
import type React from "react";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useWindowSize from "@/hooks/use-window-size";
import { cn } from "@/lib/utils";
import { IconArrowUp, IconLoader2, IconPlayerStop } from "@tabler/icons-react";

const suggestedActions = [
  {
    title: "Liste todos os contratos que vencem em 30 dias",
    label: "lista rápida",
    action: "Liste todos os contratos que vencem em 30 dias",
  },
  {
    title: "Quantos dias faltam para o vencimento do contrato mais próximo?",
    label: "lista rápida",
    action: "Quantos dias faltam para o vencimento do contrato mais próximo?",
  },
];

export function ChatInput({
  input,
  setInput, // Agora este setInput receberá o evento completo
  isLoading,
  stop,
  hasSuggestedActions = false,
  messages,
  append,
  handleSubmit,
  createNewChat,
  isCreating,
}: {
  input: string;
  setInput: (event: React.ChangeEvent<HTMLTextAreaElement>) => void; // Tipo corrigido para receber o evento
  isLoading: boolean;
  stop: () => void;
  messages: Array<Message>;
  hasSuggestedActions?: boolean;
  isCreating?: boolean;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  createNewChat?: (input: string) => Promise<void>;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 0}px`;
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event); // Passa o evento completo para a função setInput (handleInputChange do useChat)
    adjustHeight();
  };

  const submitForm = useCallback(() => {
    handleSubmit(undefined, {});

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [handleSubmit, width]);

  return (
    <div className="relative max-w-2xl mx-auto w-full flex flex-col gap-4 ">
      {messages.length === 0 && hasSuggestedActions && (
        <div className="grid sm:grid-cols-2 gap-4 w-full md:px-0 mx-auto ">
          {suggestedActions.map((suggestedAction, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.05 * index }}
              key={index}
              className={index > 1 ? "hidden sm:block" : "block"}
            >
              <button
                onClick={async () => {
                  if (createNewChat) {
                    createNewChat(suggestedAction.action);
                  } else {
                    append({
                      role: "user",
                      content: suggestedAction.action,
                    });
                  }
                }}
                disabled={isLoading}
                className="border-none cursor-pointer bg-muted/50 w-full text-left border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-lg p-3 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col disabled:opacity-50"
              >
                <span className="font-medium">{suggestedAction.title}</span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {suggestedAction.label}
                </span>
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.25 }}
      >
        <Textarea
          ref={textareaRef}
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={handleInput}
          className="min-h-[100px]  w-full overflow-hidden resize-none rounded-2xl text-base bg-muted outline-4 max-h-[200px]"
          rows={3}
          onKeyDown={(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();

              if (isLoading) {
                toast.error("Por favor, aguarde a resposta do modelo!");
              } else {
                if (createNewChat && input.length > 0) {
                  createNewChat(input);
                } else {
                  submitForm();
                }
              }
            }
          }}
        />

        {isLoading ? (
          <Button
            className={cn(
              "rounded-md p-1.5 size-8 absolute bottom-2 right-2 m-0.5 text-white bg-black transition-colors duration-200 disabled:bg-zinc-400",
              isCreating && "bg-zinc-400",
            )}
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              stop();
            }}
          >
            {isCreating ? (
              <IconLoader2 size={14} className="animate-spin" />
            ) : (
              <IconPlayerStop size={14} />
            )}
          </Button>
        ) : (
          <Button
            disabled={input.length === 0}
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              if (createNewChat && input.length > 0) {
                createNewChat(input);
              } else {
                submitForm();
              }
            }}
            className=" bg-black transition-colors duration-200 disabled:bg-zinc-400 rounded-md size-8  absolute bottom-2 right-2 m-0.5 text-white"
          >
            <div>
              <IconArrowUp size={14} />
            </div>
          </Button>
        )}
      </motion.div>
    </div>
  );
}
