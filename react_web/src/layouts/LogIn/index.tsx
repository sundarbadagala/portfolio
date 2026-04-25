import { Outlet } from "react-router-dom";
import Navbar from "@/share/organisms/Navbar";
import Container from "@/share/organisms/Container";

function LogInLayout() {
  return (
    <>
      <Container>
        <Navbar />
        <Outlet />
      </Container>
    </>
  );
}

export default LogInLayout;
