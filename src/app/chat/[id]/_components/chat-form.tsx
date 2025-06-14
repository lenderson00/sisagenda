import type { UseChatHelpers } from "@ai-sdk/react";
import { memo } from "react";
import { ChatInput } from "../../_components/chat-input";

type ChatFormProps = Pick<
  UseChatHelpers,
  "input" | "handleSubmit" | "isLoading" | "messages" | "append"
>;

interface CustomChatFormProps extends ChatFormProps {
  handleFormSubmit: (e: React.FormEvent) => void;
  handleInputChangeWrapper: (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
}

function ChatFormComponent({
  handleFormSubmit,
  input,
  handleInputChangeWrapper,
  isLoading,
  messages,
  append,
  handleSubmit,
}: CustomChatFormProps) {
  return (
    <div className="px-4 pb-4">
      <div className="mx-auto max-w-4xl">
        <form onSubmit={handleFormSubmit}>
          <ChatInput
            stop={() => {}}
            input={input}
            setInput={handleInputChangeWrapper}
            isLoading={isLoading}
            messages={messages}
            append={append}
            handleSubmit={handleSubmit}
          />
        </form>
      </div>
    </div>
  );
}

export const ChatForm = memo(ChatFormComponent);
