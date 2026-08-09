"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FaPen, FaBook, FaCode, FaGamepad, FaRobot, FaFilePdf, FaBars, FaTimes } from "react-icons/fa";
import { IoHomeSharp } from "react-icons/io5";
import Link from "next/link";
import Container from "./Container";
import ThemeToggle from "./ThemeToggle";

export const NAV_ROUTES = [
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
    name: "GenAI",
    path: "/chat",
    isPublic: true,
    icon: <FaRobot size={20} />,
  },
  {
    name: "RagPdf",
    path: "/rag",
    isPublic: true,
    icon: <FaFilePdf size={20} />,
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    isPublic: true,
    icon: <FaPen size={20} />,
  },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on path change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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

  return (
    <Container className="border border-[var(--foreground)] sticky top-3 rounded-xl bg-[var(--background)] z-10">
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
              // Path matches active route exactly or starts with it (except root)
              const isActive = item.path === "/" 
                ? pathname === "/" 
                : pathname.startsWith(item.path);

              return (
                <Link
                  href={item.path}
                  key={index}
                  className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    isActive ? "opacity-100 font-semibold" : "opacity-60 hover:opacity-100"
                  }`}
                  title={item.name}
                >
                  <span className="text-[20px]">{item.icon}</span>
                  <span className="hidden lg:inline text-[16px]">{item.name}</span>
                </Link>
              );
            })}
          </div>
          <ThemeToggle />
        </div>

        {/* Mobile Left Drawer Overlay */}
        <div
          onClick={() => setIsOpen(false)}
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        />

        {/* Mobile Left Drawer Panel */}
        <div
          className={`fixed top-0 left-0 bottom-0 w-64 bg-[var(--background)] border-r border-[var(--foreground)] p-6 z-50 md:hidden flex flex-col gap-6 shadow-2xl transition-transform duration-300 ${
            isOpen ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none"
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
          <div className="flex flex-col gap-4 overflow-y-auto">
            {NAV_ROUTES.map((item, index) => {
              if (!item.isPublic) return null;
              const isActive = item.path === "/" 
                ? pathname === "/" 
                : pathname.startsWith(item.path);

              return (
                <Link
                  href={item.path}
                  key={index}
                  className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 ${
                    isActive
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
