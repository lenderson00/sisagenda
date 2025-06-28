"use client";

import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { IconMoon, IconSun, IconUsers } from "@tabler/icons-react";
import { Switch } from "./ui/switch";

export function ModeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  const handleSwitchClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleTheme();
    },
    [toggleTheme],
  );

  return (
    <div
      className="flex items-center justify-between w-full"
      onClick={handleSwitchClick}
      onKeyDown={() => handleSwitchClick}
    >
      <div className="flex items-center gap-2">
        {resolvedTheme === "dark" ? <IconMoon /> : <IconSun />}
        <span>Modo {resolvedTheme === "dark" ? "Escuro" : "Claro"}</span>
      </div>

      <Switch
        checked={resolvedTheme === "dark"}
        onCheckedChange={toggleTheme}
      />

      <span className="sr-only">Toggle theme</span>
    </div>
  );
}
