import { ReactNode } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
