"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, ExternalLink, Search, Settings } from "lucide-react";
import Link from "next/link";
import { NavTabs, type Tab } from "./tabs";

type Props = {
  tabs: Tab[];
};

export function TopNavigation({ tabs }: Props) {
  return (
    <div className="border-b bg-white shadow-none">
      {/* Top Bar */}
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-6 h-6 bg-gray-900"
              style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
            />
            <span className="font-semibold text-gray-900">
              Scheduling System
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Live
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-700 hover:bg-gray-100"
          >
            Feedback
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-700 hover:bg-gray-100"
          >
            <Bell className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-700 hover:bg-gray-100"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback className="bg-gray-100 text-gray-700">
              AD
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <NavTabs tabs={tabs} />
    </div>
  );
}
