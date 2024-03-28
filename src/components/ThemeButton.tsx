"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa6";

export default function ThemeButton({
  isListButton = false,
}: {
  isListButton?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }

  if (isListButton) {
    return (
      <div>
        <button
          type="button"
          className="text-sky-50 px-4 py-2 border-2 border-sky-100 bg-sky-500 rounded-full "
          onClick={handleClick}
        >
          Toggle Theme
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        className="flex gap-2 items-center"
        onClick={handleClick}
      >
        {theme === "light" ? (
          <FaMoon className="" />
        ) : (
          <FaSun className="fill-sky-500" />
        )}{" "}
        <span className="hidden md:inline whitespace-nowrap">Toggle Theme</span>
      </button>
    </div>
  );
}
