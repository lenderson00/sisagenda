import { AccountAvatar } from "@/components/account-avatar";
import { CommandMenu } from "@/components/command-menu";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import Link from "next/link";

const mockTree = {
  children: [
    {
      label: "Nova Conversa",
      href: "/chat",
    },
  ],
};

const mockColors: any[] = [];

export const ChatHeader = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "@container/chat-header relative z-20 flex h-14 w-full shrink-0 items-center justify-between gap-4 sm:h-11 sm:px-2 bg-sidebar px-4",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-6 h-6 bg-gray-900"
            style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
          />
          <span className="font-semibold text-gray-900">Scheduling System</span>
        </Link>
      </div>

      <div className="flex items-center gap-4 relative z-10">
        <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
          {/* <div className="hidden w-full flex-1 md:flex md:w-auto md:flex-none border rounded-md">
            <CommandMenu tree={mockTree} />
          </div> */}

          <nav className="flex items-center gap-2 ml-4">
            <AccountAvatar className="size-6" />
          </nav>
        </div>
      </div>
    </div>
  );
};
