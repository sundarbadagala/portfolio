import { Outlet } from "react-router-dom";
import Container from "@/share/organisms/Container";
import Navbar from "@/share/organisms/Navbar";
import Sidebar from "@/share/organisms/Sidebar";
import { Flex } from "@chakra-ui/react";
import SmoothScroll from "@/share/organisms/SmoothScroll";

function LoggedInLayout() {
  return (
    <SmoothScroll>
      <Flex>
        <Sidebar />
        <Container>
          <Navbar />
          <Outlet />
        </Container>
      </Flex>
    </SmoothScroll>
  );
}

export default LoggedInLayout;
