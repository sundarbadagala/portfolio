import { Outlet } from "react-router-dom";
import Navbar from "@/share/organisms/Navbar";
import Container from "@/share/organisms/Container";
import SmoothScroll from "@/share/organisms/SmoothScroll";

function LogInLayout() {
  return (
    <SmoothScroll>
      <Container>
        <Navbar />
        <Outlet />
      </Container>
    </SmoothScroll>
  );
}

export default LogInLayout;
