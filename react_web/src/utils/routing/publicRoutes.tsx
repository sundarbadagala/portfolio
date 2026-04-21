import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

function PublicRoutes({ isCommonRoute }: any) {
  const token = useAuth();
  return isCommonRoute ? (
    <Outlet />
  ) : token ? (
    <Navigate to="/dashboard" />
  ) : (
    <Outlet />
  );
}

export default PublicRoutes;
