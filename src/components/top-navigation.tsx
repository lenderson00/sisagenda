"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, ExternalLink, Search, Settings } from "lucide-react";
import Link from "next/link";
import { AccountAvatar } from "./account-avatar";
import { NavTabs, type Tab } from "./tabs";
import { TopBar } from "./top-bar";

type Props = {
  tabs: Tab[];
};

export function TopNavigation({ tabs }: Props) {
  return (
    <div className="border-b bg-white shadow-none">
      {/* Top Bar */}
      <TopBar />

      <NavTabs tabs={tabs} />
    </div>
  );
}
