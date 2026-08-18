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
      <div
        className="
          relative
          h-10
          w-[72px]
          rounded-full
          border
          border-gray-200
          bg-gray-100
          dark:border-gray-700
          dark:bg-gray-800
        "
      >
        <div
          className="
            absolute
            left-1
            top-1
            h-8
            w-8
            rounded-full
            bg-white
            shadow-sm
          "
        />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={handleToggle}
      className={`
        relative
        h-10
        w-[72px]
        shrink-0
        rounded-full
        border
        transition-all
        duration-300
        focus:outline-none
        focus:ring-2
        focus:ring-gray-300
        dark:focus:ring-gray-600

        ${
          isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-100"
        }
      `}
    >
      {/* Background icons */}

      <span
        className={`
          absolute
          left-2.5
          top-1/2
          -translate-y-1/2
          text-sm
          transition-opacity
          duration-300

          ${isDark ? "opacity-40" : "opacity-100"}
        `}
      >
        ☀️
      </span>

      <span
        className={`
          absolute
          right-2.5
          top-1/2
          -translate-y-1/2
          text-sm
          transition-opacity
          duration-300

          ${isDark ? "opacity-100" : "opacity-40"}
        `}
      >
        🌙
      </span>

      {/* Slider */}

      <span
        className={`
          absolute
          top-1
          h-8
          w-8
          rounded-full
          bg-white
          shadow-md
          transition-transform
          duration-300
          ease-in-out

          ${isDark ? "translate-x-8" : "translate-x-0"}
        `}
      />
    </button>
  );
}

// "use client";

// import { useEffect, useState } from "react";

// import { useTheme } from "next-themes";

// export default function ThemeToggle() {
//   const { resolvedTheme, setTheme } = useTheme();

//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) {
//     return (
//       <button
//         type="button"
//         aria-label="Change theme"
//         className="
//           h-10
//           w-10
//           rounded-lg
//           border
//           border-gray-200
//           bg-white
//           dark:border-gray-800
//           dark:bg-gray-900
//         "
//       />
//     );
//   }

//   const isDark = resolvedTheme === "dark";

//   return (
//     <button
//       type="button"
//       onClick={() => setTheme(isDark ? "light" : "dark")}
//       aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
//       className="
//         relative
//         flex
//         h-10
//         w-10
//         items-center
//         justify-center
//         rounded-lg
//         border
//         border-gray-200
//         bg-white
//         text-gray-700
//         shadow-sm
//         transition
//         hover:bg-gray-100

//         dark:border-gray-700
//         dark:bg-gray-900
//         dark:text-gray-200
//         dark:hover:bg-gray-800
//       "
//     >
//       <span className="text-lg">{isDark ? "☀️" : "🌙"}</span>
//     </button>
//   );
// }
