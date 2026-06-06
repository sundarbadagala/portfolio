import { FaPen } from "react-icons/fa";
import { IoHomeSharp } from "react-icons/io5";
import Link from "next/link";
import Container from "./Container";
import ThemeToggle from "./ThemeToggle";

export const NAV_ROUTES = [
  {
    name: "Home",
    path: process.env.API_PORTFOLIO_URL || "",
    isPublic: true,
    icon: <IoHomeSharp size={22} />
  },
  //   {
  //     name: "Blogs",
  //     path: "https://sundars-blogs.vercel.app/blogs",
  //     isPublic: true,
  //     icon: <FaBook size={22} />
  //   },
  //   {
  //     name: "Login",
  //     path: "/login",
  //     isPublic: true,
  //     icon: <RiLoginCircleFill size={28} />
  //   },
  {
    name: "Dashboard",
    path: "/dashboard",
    isPublic: false,
    icon: <FaPen />
  }
];

function Navbar() {
  return (
    <Container className="border border-[var(--foreground)] sticky top-3 rounded-xl bg-[var(--background)] z-10">
      <nav className="flex items-center !justify-end h-[60px] px-4">
        <div className="flex items-center gap-6 mr-4">
          {NAV_ROUTES.map((item, index) =>
            item.isPublic ? (
              <Link
                href={item.path}
                key={index}
                className="flex items-center gap-1.5 text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
              >
                <span className="sm:inline text-[18px]">{item.name}</span>
              </Link>
            ) : null
          )}
        </div>
        <ThemeToggle />
      </nav>
    </Container>
  );
}

export default Navbar;
