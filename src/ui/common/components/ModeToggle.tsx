"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme } = useTheme();

  const applyThemeWithAnimation = (newTheme: string, animClass: string) => {
    document.documentElement.classList.remove(
      "light-anim",
      "dark-anim",
      "system-anim"
    );
    document.documentElement.classList.add(animClass);

    if (!document.startViewTransition) {
      setTheme(newTheme);
    } else {
      document.startViewTransition(() => setTheme(newTheme));
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => applyThemeWithAnimation("light", "light-anim")}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => applyThemeWithAnimation("dark", "dark-anim")}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => applyThemeWithAnimation("system", "system-anim")}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
