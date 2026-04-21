import { NavLink as RouteNavLink } from "react-router-dom";
import styles from "./styles.module.css";

function NavLink({ href, children }: any) {
  return (
    <RouteNavLink
      to={href}
      className={({ isActive }) =>
        isActive ? styles.active_link : styles.link
      }
    >
      {children}
    </RouteNavLink>
  );
}

export default NavLink;
