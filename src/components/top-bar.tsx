import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { Bell } from "lucide-react";
import { Settings } from "lucide-react";
import Link from "next/link";
import { AccountAvatar } from "./account-avatar";
import { Button } from "./ui/button";

export const TopBar = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn("flex h-14 items-center justify-between px-6", className)}
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

      <div className="flex items-center gap-4">
        <AccountAvatar />
      </div>
    </div>
  );
};
