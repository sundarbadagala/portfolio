import { Flex } from "@chakra-ui/react";
import { NAV_ROUTES } from "@/helper/routes";
import { INavItem } from "./interface";
import { NavLink } from "@/share/atoms/links";
import ThemeButton from "@/share/molecule/ThemeButton";
import { motion } from "framer-motion";

function Navbar() {
  return (
    <Flex
      borderRadius={"12px"}
      align={"center"}
      justify={"flex-end"}
      height={"60px"}
      // border={"1px solid"}
      borderColor={"contrast"}
      position={"sticky"}
      top={"10px"}
      zIndex={100}
      width={"100%"}
      bgColor={"bg"}
      gap={"16px"}
    >
      {NAV_ROUTES.map((item: INavItem, index: number) => {
        return item.isPublic ? (
          <NavLink href={item.path} key={index}>
            <motion.div 
              whileHover={{ scale: 0.95 }} 
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Flex align={"center"} gap={"6px"} pb={"4px"}>
                {item.name}
              </Flex>
            </motion.div>
          </NavLink>
        ) : null;
      })}
      <ThemeButton />
    </Flex>
  );
}

export default Navbar;
