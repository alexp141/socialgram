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
    <>
      <button
        onClick={handleClick}
        className="absolute top-4 left-4 w-12 h-12 hidden"
      >
        {theme === "light" ? (
          <FaMoon className="w-full h-auto" />
        ) : (
          <FaSun className="w-full h-auto fill-sky-500" />
        )}
      </button>
    </>
  );
}
