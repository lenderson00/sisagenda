import { IconPointFilled } from "@tabler/icons-react";
import { memo } from "react";
import { ChatContainerContent } from "./chat-container";
import { ChatMessage, type ChatStatus } from "./chat-messages";
import { ScrollButton } from "./scroll-button";

interface MessageListProps {
  messages: any[];
  status: ChatStatus;
}

function MessageListComponent({ messages, status }: MessageListProps) {
  return (
    <ChatContainerContent
      className="flex w-full flex-col pt-20 pb-16  px-4 max-w-2xl mx-auto overflow-x-hidden"
      style={{
        scrollbarGutter: "stable both-edges",
        scrollbarWidth: "none",
      }}
    >
      {messages.map((msg, index) => (
        <ChatMessage
          key={msg.id}
          message={msg as any}
          status={status}
          isLastMessage={index === messages.length - 1}
        />
      ))}

      {status === "submitted" &&
        messages.length > 0 &&
        messages[messages.length - 1].role === "user" && (
          <div className="h-10 ">
            <IconPointFilled className="size-10 motion-preset-pulse-md " />
          </div>
        )}
      <div className="absolute bottom-0 inset-x-0 max-w-2xl mx-auto">
        <ScrollButton className="absolute bottom-4 right-4 md:right-0" />
      </div>
    </ChatContainerContent>
  );
}

export const MessageList = memo(MessageListComponent);
