import { FaPen } from "react-icons/fa";
import { IoHomeSharp } from "react-icons/io5";
import { RiLoginCircleFill } from "react-icons/ri";
import { FaBook } from "react-icons/fa";

import LandingPage from "@/components/landing-page";
import Login from "@/components/login";
import DashBoard from "@/components/dashboard";
import Blogs from "@/components/blogs";
import Blog from "@/components/blog";
import Dummy from "@/components/dummy";

import BlogsList from "@/components/dashboard/sections/blogs-list";
import BlogsEdit from "@/components/dashboard/sections/blogs-edit";
import QuestionsList from "@/components/dashboard/sections/questions-list";

export const NAV_ROUTES = [
  {
    name: "Home",
    path: "/",
    isPublic: true,
    icon: <IoHomeSharp size={22} />
  },
  {
    name: "Blogs",
    path: "/blogs",
    isPublic: true,
    icon: <FaBook size={22} />
  },
  {
    name: "Login",
    path: "/login",
    isPublic: true,
    icon: <RiLoginCircleFill size={28} />
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    isPublic: false,
    icon: <FaPen />
  }
];

export const SIDE_BAR_ROUTES = [
  {
    name: "Blogs",
    path: "/dashboard/blogs/list",
    icon: <IoHomeSharp size={22} />
  },
  {
    name: "Questions",
    path: "/dashboard/questions/list",
    isPublic: false,
    icon: <IoHomeSharp size={22} />
  }
];

export const publicRoutes = [
  {
    path: "/",
    element: <LandingPage />,
    isCommonRoute: false
  },
  {
    path: "/login",
    element: <Login />,
    isCommonRoute: false
  },
  {
    path: "/blogs",
    element: <Blogs />,
    isCommonRoute: true
  },
  {
    path: "/blog/:id",
    element: <Blog />,
    isCommonRoute: true
  },
  {
    path: "/dummy",
    element: <Dummy />
  }
];

export const privateRoutes = [
  {
    path: "/dashboard",
    element: <DashBoard />
  },
  {
    path: "/dashboard/blogs/list",
    element: <BlogsList />
  },
  {
    path: "/dashboard/blogs/edit",
    element: <BlogsEdit />
  },
  {
    path: "/dashboard/questions/list",
    element: <QuestionsList />
  },
  {
    path: "/dashboard/questions/edit",
    element: <QuestionsList />
  }
];

export const NAVIGATE = {
  login: {
    dashboard: "/dashboard"
  },
  blogs: {
    id: `/blog`
  }
};
