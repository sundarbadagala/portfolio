import { ICONS } from "@/helper/icons";
import { useColorMode, IconButton, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";

function ThemeButton() {
  const { colorMode, toggleColorMode } = useColorMode();
  
  const bgToken = "bg";

  return (
    <motion.div 
      whileHover={{ scale: 0.95 }} 
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <IconButton
        onClick={toggleColorMode}
        aria-label="Theme toggle"
        data-testid="theme-btn"
        borderRadius={"50%"}
        padding={"0px"}
        bg={bgToken}
        transition="all 0.3s ease"
        color={useColorModeValue("black", "white")}
        border={'1px solid'}
      >
        {colorMode === "dark" ? (
          <ICONS.OutlineSun data-testid="light-btn" size={"24px"} />
        ) : (
          <ICONS.Sun data-testid="dark-btn" size={"24px"} />
        )}
      </IconButton>
    </motion.div>
  );
}

export default ThemeButton;
