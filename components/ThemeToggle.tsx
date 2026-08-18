"use client";

import { useEffect, useState } from "react";

import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Change theme"
        className="
          h-10
          w-10
          rounded-lg
          border
          border-gray-200
          bg-white
          dark:border-gray-800
          dark:bg-gray-900
        "
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="
        relative
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-lg
        border
        border-gray-200
        bg-white
        text-gray-700
        shadow-sm
        transition
        hover:bg-gray-100

        dark:border-gray-700
        dark:bg-gray-900
        dark:text-gray-200
        dark:hover:bg-gray-800
      "
    >
      <span className="text-lg">{isDark ? "☀️" : "🌙"}</span>
    </button>
  );
}
