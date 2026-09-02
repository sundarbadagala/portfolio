"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaCircleNotch,
} from "react-icons/fa";
import { useAuth } from "@/features/auth/context/AuthContext";

interface NavProfileProps {
  onItemClick?: () => void;
  isDrawer?: boolean;
}

export default function NavProfile({
  onItemClick,
  isDrawer = false,
}: NavProfileProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on route change
  useEffect(() => {
    setIsProfileOpen(false);
  }, [pathname]);

  // Click outside to close dropdown
  useEffect(() => {
    if (isDrawer) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDrawer]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setIsProfileOpen(false);
      onItemClick?.();
      if (pathname.startsWith("/ai")) {
        router.push("/auth");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // 1. Drawer Variant (for mobile navigation drawer)
  if (isDrawer) {
    if (loading) {
      return <div className="h-12 bg-[var(--foreground)]/10 rounded-xl animate-pulse" />;
    }

    if (!user) {
      return (
        <Link
          href="/auth"
          onClick={onItemClick}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-all text-sm shadow"
        >
          <FaSignInAlt className="text-sm" />
          <span>Login / Register</span>
        </Link>
      );
    }

    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--foreground)]/5 border border-[var(--foreground)]/10">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-base shadow shrink-0">
            {user.username ? user.username.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-semibold text-sm truncate">{user.username}</span>
            <span className="text-xs opacity-60 truncate">{user.email}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Link
            href="/auth"
            onClick={onItemClick}
            className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-sm opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <FaUser className="text-xs opacity-70" />
            <span>Profile</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            {isLoggingOut ? (
              <FaCircleNotch className="animate-spin text-xs" />
            ) : (
              <FaSignOutAlt className="text-xs" />
            )}
            <span>Logout</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. Navbar Variant (Top bar beside nav items)
  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-[var(--foreground)]/10 animate-pulse shrink-0" />
    );
  }

  if (!user) {
    return (
      <Link
        href="/auth"
        id="navbar-login-btn"
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-200 hover:scale-105"
        title="Login"
      >
        <FaSignInAlt className="text-xs" />
        <span>Login</span>
      </Link>
    );
  }

  return (
    <div ref={containerRef} className="relative profile-dropdown-container">
      {/* Profile Icon with First Letter of Username */}
      <button
        type="button"
        id="navbar-profile-btn"
        onClick={() => setIsProfileOpen((prev) => !prev)}
        className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md hover:ring-2 hover:ring-[var(--foreground)] hover:scale-105 active:scale-95 transition-all cursor-pointer select-none"
        title={user.username}
        aria-label="User profile menu"
        aria-expanded={isProfileOpen}
      >
        {user.username ? user.username.charAt(0).toUpperCase() : "U"}
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute top-full right-0 mt-2 transition-all duration-200 z-50 ${
          isProfileOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-1 pointer-events-none"
        }`}
      >
        <div className="bg-[var(--background)] border border-[var(--foreground)] rounded-xl shadow-2xl p-2 min-w-[200px] flex flex-col gap-1 backdrop-blur-md">
          {/* User Info */}
          <div className="px-3 py-2 border-b border-[var(--foreground)]/20 mb-1">
            <p className="text-sm font-semibold truncate leading-tight">
              {user.username}
            </p>
            <p className="text-xs opacity-60 truncate mt-0.5">{user.email}</p>
            {user.role && (
              <span className="inline-block mt-1.5 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500">
                {user.role}
              </span>
            )}
          </div>

          {/* Profile Route Link */}
          <Link
            href="/auth"
            onClick={() => setIsProfileOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <FaUser className="text-xs opacity-70" />
            <span>Profile</span>
          </Link>

          {/* Logout Option Button */}
          <button
            type="button"
            id="navbar-logout-btn"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer text-left disabled:opacity-50"
          >
            {isLoggingOut ? (
              <FaCircleNotch className="animate-spin text-xs" />
            ) : (
              <FaSignOutAlt className="text-xs" />
            )}
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
