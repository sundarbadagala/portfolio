"use client";

import { ReactNode } from "react";
import Navbar from "./NavBar";
import SmoothScroll from "./SmoothScroll";
import { AuthProvider } from "@/features/auth/context/AuthContext";
// import Footer from "./Footer";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SmoothScroll>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-1">{children}</div>
        </div>
      </SmoothScroll>
    </AuthProvider>
  );
}

