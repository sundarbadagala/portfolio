import { SIDE_BAR_ROUTES } from "@/helper/routes";
import { Box, Flex } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  // const [isExpand, setIsExpand] = useState(true);
  // const handleExpand = () => {
  //   setIsExpand((prev) => !prev);
  // };
  return (
    <div>
      <Box
        width={true ? "200px" : "50px"}
        height={"100vh"}
        backgroundColor={"#ffff"}
        // position={"absolute"}
        left={0}
        zIndex={101}
        transition={"all 0.3s ease-in-out"}
        p={"24px 12px"}
        overflow={"hidden"}
      >
        <Flex
          height={"100px"}
          bgColor={"black"}
          justify={"center"}
          alignItems={"center"}
          color={"#ffffff"}
          borderRadius={"12px"}
        >
          A
        </Flex>

        <Flex direction={"column"} gap={"24px"} p={"24px 0"}>
          {SIDE_BAR_ROUTES.map((item) => (
            <NavLink to={item.path}>
              <Flex gap={"12px"}>
                <Box as="span">{item.icon}</Box>
                <Box as="span">{item.name}</Box>
              </Flex>
            </NavLink>
          ))}
        </Flex>
      </Box>
    </div>
  );
}

export default Sidebar;
