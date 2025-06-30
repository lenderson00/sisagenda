"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";

import { useUnreadCount, useNotifications } from "@/hooks/use-notifications";
import { Inbox } from "./inbox";

interface NotificationBellProps {
  className?: string;
}

export function NotificationBell({ className }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Get unread count for badge
  const { data: unreadData, isLoading: isUnreadLoading } = useUnreadCount();
  const unreadCount = unreadData?.count || 0;

  // Prefetch notifications when popover opens
  const { isLoading: isNotificationsLoading } = useNotifications({
    page: 1,
    limit: 5,
    status: "UNREAD",
  });

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`relative h-9 w-9 p-0 ${className}`}
        >
          <Bell className="h-4 w-4" />
          {isUnreadLoading ? (
            <Skeleton className="absolute -top-1 -right-1 h-5 w-5 rounded-full" />
          ) : unreadCount > 0 ? (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          ) : null}
          <span className="sr-only">
            {unreadCount > 0
              ? `${unreadCount} notificações não lidas`
              : "Notificações"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-96 p-0"
        align="end"
        side="bottom"
        sideOffset={8}
      >
        <div className="max-h-[80vh] overflow-hidden">
          <Inbox className="border-0 shadow-none" />
        </div>
      </PopoverContent>
    </Popover>
  );
}
