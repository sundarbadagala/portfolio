"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  FaPen,
  FaBook,
  FaCode,
  FaGamepad,
  FaRobot,
  FaFilePdf,
  FaClipboardList,
  FaBars,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
import { IoHomeSharp } from "react-icons/io5";
import Link from "next/link";
import Container from "./Container";
import ThemeToggle from "./ThemeToggle";

export interface NavChildItem {
  name: string;
  path: string;
  isPublic: boolean;
  icon?: React.ReactNode;
}

export interface NavItem {
  name: string;
  path?: string;
  isPublic: boolean;
  icon: React.ReactNode;
  children?: NavChildItem[];
}

export const NAV_ROUTES: NavItem[] = [
  {
    name: "Portfolio",
    path: process.env.NEXT_PUBLIC_API_PORTFOLIO_URL || "",
    isPublic: true,
    icon: <IoHomeSharp size={20} />,
  },
  {
    name: "Blogs",
    path: "/blogs",
    isPublic: true,
    icon: <FaBook size={20} />,
  },
  {
    name: "Q&A",
    path: "/q&a",
    isPublic: true,
    icon: <FaPen size={20} />,
  },
  {
    name: "Compiler",
    path: "/compiler",
    isPublic: true,
    icon: <FaCode size={20} />,
  },
  {
    name: "Games",
    path: "/games",
    isPublic: true,
    icon: <FaGamepad size={20} />,
  },
  {
    name: "AI",
    path: "/ai",
    isPublic: true,
    icon: <FaRobot size={20} />,
    children: [
      {
        name: "GenAI",
        path: "/ai/chat",
        isPublic: true,
        icon: <FaRobot size={18} />,
      },
      {
        name: "RagPdf",
        path: "/ai/rag",
        isPublic: true,
        icon: <FaFilePdf size={18} />,
      },
      {
        name: "Skill Tests",
        path: "/ai/test",
        isPublic: true,
        icon: <FaClipboardList size={18} />,
      },
    ],
  },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({ AI: true });
  const pathname = usePathname();

  // Close drawer and dropdown on path change
  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Click outside to close desktop dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".nav-dropdown-container")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isRouteActive = (item: NavItem) => {
    if (item.children && item.children.length > 0) {
      return item.children.some((child) =>
        child.path === "/" ? pathname === "/" : pathname.startsWith(child.path)
      );
    }
    if (!item.path) return false;
    return item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
  };

  return (
    <Container className="border border-[var(--foreground)] sticky top-3 rounded-xl bg-[var(--background)] z-30">
      <nav className="flex items-center justify-between h-[60px] px-4">
        {/* Left Side: Mobile Menu Button (Hamburger) */}
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden p-2 text-[var(--foreground)] opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Open navigation menu"
        >
          <FaBars size={22} />
        </button>

        {/* Spacer for mobile layout alignment */}
        <div className="flex-1 md:hidden" />

        {/* Right Side: Desktop/Tablet navigation & Theme Toggle */}
        <div className="flex items-center gap-6 w-auto justify-end md:ml-auto">
          {/* Horizontal nav routes (Desktop & Tablet) */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_ROUTES.map((item, index) => {
              if (!item.isPublic) return null;
              const isActive = isRouteActive(item);

              if (item.children && item.children.length > 0) {
                const isDropdownOpen = openDropdown === item.name;

                return (
                  <div
                    key={index}
                    className="relative nav-dropdown-container"
                    onMouseEnter={() => setOpenDropdown(item.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDropdown((prev) =>
                          prev === item.name ? null : item.name
                        )
                      }
                      className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:scale-105 cursor-pointer bg-transparent border-0 p-0 text-[var(--foreground)] font-inherit leading-normal ${isActive || isDropdownOpen
                        ? "opacity-100 font-semibold"
                        : "opacity-60 hover:opacity-100"
                        }`}
                      title={item.name}
                      aria-expanded={isDropdownOpen}
                    >
                      <span className="inline lg:hidden text-[20px]">
                        {item.icon}
                      </span>
                      <span className="hidden lg:inline text-[16px]">
                        {item.name}
                      </span>
                      <FaChevronDown
                        className={`text-xs transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200 ${isDropdownOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-1 pointer-events-none"
                        }`}
                    >
                      <div className="bg-[var(--background)] border border-[var(--foreground)] rounded-xl shadow-xl p-1.5 min-w-[150px] flex flex-col gap-1 backdrop-blur-md">
                        {item.children.map((child, cIndex) => {
                          if (!child.isPublic) return null;
                          const isChildActive =
                            child.path === "/"
                              ? pathname === "/"
                              : pathname.startsWith(child.path);

                          return (
                            <Link
                              key={cIndex}
                              href={child.path}
                              onClick={() => setOpenDropdown(null)}
                              className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-all duration-150 ${isChildActive
                                ? "bg-[var(--foreground)] text-[var(--background)] font-medium"
                                : "opacity-75 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10"
                                }`}
                            >
                              {child.icon && (
                                <span className="text-[18px]">
                                  {child.icon}
                                </span>
                              )}
                              <span>{child.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  href={item.path || "#"}
                  key={index}
                  className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${isActive
                    ? "opacity-100 font-semibold"
                    : "opacity-60 hover:opacity-100"
                    }`}
                  title={item.name}
                >
                  <span className="inline lg:hidden text-[20px]">
                    {item.icon}
                  </span>
                  <span className="hidden lg:inline text-[16px]">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
          <ThemeToggle />
        </div>

        {/* Mobile Left Drawer Overlay */}
        <div
          onClick={() => setIsOpen(false)}
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
            }`}
        />

        {/* Mobile Left Drawer Panel */}
        <div
          className={`fixed top-0 left-0 bottom-0 w-64 bg-[var(--background)] border-r border-[var(--foreground)] p-6 z-50 md:hidden flex flex-col gap-6 shadow-2xl transition-transform duration-300 ${isOpen
            ? "translate-x-0 pointer-events-auto"
            : "-translate-x-full pointer-events-none"
            }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-[var(--foreground)] pb-4">
            <span className="font-semibold text-lg">Menu</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Close navigation menu"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Drawer Links */}
          <div className="flex flex-col gap-3 overflow-y-auto">
            {NAV_ROUTES.map((item, index) => {
              if (!item.isPublic) return null;
              const isActive = isRouteActive(item);

              if (item.children && item.children.length > 0) {
                const isExpanded = !!mobileExpanded[item.name];

                return (
                  <div key={index} className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setMobileExpanded((prev) => ({
                          ...prev,
                          [item.name]: !prev[item.name],
                        }))
                      }
                      className={`flex items-center justify-between py-2 px-3 rounded-lg transition-all duration-200 ${isActive
                        ? "opacity-100 font-semibold"
                        : "opacity-70 hover:opacity-100 hover:bg-slate-100 dark:hover:bg-zinc-800"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[20px]">{item.icon}</span>
                        <span className="text-[16px]">{item.name}</span>
                      </div>
                      <FaChevronDown
                        className={`text-xs transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="pl-4 flex flex-col gap-1 border-l-2 border-[var(--foreground)]/20 ml-5 my-1">
                        {item.children.map((child, cIndex) => {
                          if (!child.isPublic) return null;
                          const isChildActive =
                            child.path === "/"
                              ? pathname === "/"
                              : pathname.startsWith(child.path);

                          return (
                            <Link
                              key={cIndex}
                              href={child.path}
                              onClick={() => setIsOpen(false)}
                              className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 ${isChildActive
                                ? "bg-[var(--foreground)] text-[var(--background)] font-semibold"
                                : "opacity-70 hover:opacity-100 hover:bg-slate-100 dark:hover:bg-zinc-800"
                                }`}
                            >
                              {child.icon && (
                                <span className="text-[18px]">
                                  {child.icon}
                                </span>
                              )}
                              <span className="text-[15px]">{child.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  href={item.path || "#"}
                  key={index}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 ${isActive
                    ? "bg-[var(--foreground)] text-[var(--background)] font-semibold"
                    : "opacity-70 hover:opacity-100 hover:bg-slate-100 dark:hover:bg-zinc-800"
                    }`}
                >
                  <span className="text-[20px]">{item.icon}</span>
                  <span className="text-[16px]">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </Container>
  );
}

export default Navbar;
