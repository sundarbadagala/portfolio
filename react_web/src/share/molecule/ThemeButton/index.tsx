import { ICONS } from "@/helper/icons";
import { useColorMode, IconButton, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";

function ThemeButton() {
  const { colorMode, toggleColorMode } = useColorMode();
  
  const bgToken = "bg";
  const outerShadow = useColorModeValue(
    "8px 8px 16px #c9c7c8, -8px -8px 16px #ffffff",
    "8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.08)"
  );
  
  const innerShadow = useColorModeValue(
    "inset 6px 6px 12px #c9c7c8, inset -6px -6px 12px #ffffff",
    "inset 6px 6px 12px rgba(0, 0, 0, 0.5), inset -6px -6px 12px rgba(255, 255, 255, 0.08)"
  );

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
        boxShadow={outerShadow}
        transition="all 0.3s ease"
        color={useColorModeValue("black", "white")}
        _hover={{ boxShadow: outerShadow }}
        _active={{ boxShadow: innerShadow }}
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
