"use client";
import { HiOutlineSun, HiSun } from "react-icons/hi";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const isDark = saved ? saved === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      className="border border-[var(--foreground)] rounded-full p-2"
      aria-label="Toggle theme"
    >
      {dark ? <HiOutlineSun size={"24px"} /> : <HiSun size={"24px"} />}
    </button>
  );
}
