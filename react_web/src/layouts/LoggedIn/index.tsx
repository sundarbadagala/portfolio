import { Outlet } from "react-router-dom";
import Container from "@/share/organisms/Container";
import Navbar from "@/share/organisms/Navbar";
import Sidebar from "@/share/organisms/Sidebar";
import { Flex } from "@chakra-ui/react";

function LoggedInLayout() {
  return (
    <Flex>
      <Sidebar />
      <Container>
        <Navbar />
        <Outlet />
      </Container>
    </Flex>
  );
}

export default LoggedInLayout;
