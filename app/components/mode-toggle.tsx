"use client";

import * as React from "react";
import { ChevronDownIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const [refresh, setRefresh ]= React.useState(false);


  {/* Refresh the Page When User Changes Theme */}
  const refreshPageOnThemeChange = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-start">
          {theme === "light" && (
            <div className="flex justify-between w-full scale-100 dark:scale-0">
            <p>Light Mode</p>
            <ChevronDownIcon className="w-5 h-5" />
          </div>
          )}
          {theme === "dark" && (
            <div className=" flex justify-between w-full scale-0 dark:scale-100">
            <p>Dark Mode</p>
            <ChevronDownIcon className="w-5 h-5" />
          </div>
          )}
          <span className="sr-only">Toggle Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuItem onClick={() => {
          setTheme("light");
          refreshPageOnThemeChange();
        }}>
          <SunIcon className="w-3 h-3 mr-3" />
          <span>Light Mode</span>

        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          setTheme("dark");
          refreshPageOnThemeChange();
        }}>
          <MoonIcon className="w-3 h-3 mr-3" />
          <span>Dark Mode</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
