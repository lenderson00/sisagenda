import { MessagesProvider } from "./_context/message";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MessagesProvider>{children}</MessagesProvider>;
}
