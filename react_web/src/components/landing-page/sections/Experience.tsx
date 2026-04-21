import { useRef } from "react";
import { Box, Flex, ListItem, Text, UnorderedList, useColorModeValue } from "@chakra-ui/react";
import Wrapper from "@/share/organisms/Wrapper";
import { motion, useScroll, useSpring } from "framer-motion";
import { FaBriefcase } from "react-icons/fa";

import { WORK_EXPERIENCE } from "@/helper/constants";

export default function Experience() {
  const containerRef = useRef(null);

  // Track scroll progress within this specific container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Apply a spring physics smoothing to the scroll line
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const bgToken = "bg";
  const outerShadow = useColorModeValue(
    "8px 8px 16px #c9c7c8, -8px -8px 16px #ffffff",
    "8px 8px 16px rgba(0,0,0,0.4), -8px -8px 16px rgba(255,255,255,0.08)"
  );
  const innerShadow = useColorModeValue(
    "inset 6px 6px 12px #c9c7c8, inset -6px -6px 12px #ffffff",
    "inset 6px 6px 12px rgba(0,0,0,0.4), inset -6px -6px 12px rgba(255,255,255,0.08)"
  );
  const lineBg = useColorModeValue("blue.600", "blue.300");

  return (
    <Wrapper>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Text variant={"H1"} mb={12}>WORK EXPERIENCE</Text>
      </motion.div>

      <Box ref={containerRef} position="relative" mx="auto" pb={8}>
        {/* The Animated Vertical Line */}
        <Box
          position="absolute"
          left={{ base: "20px", md: "50%" }}
          top="0"
          bottom="0"
          w="4px"
          bg={useColorModeValue("gray.300", "whiteAlpha.200")}
          transform="translateX(-50%)"
          borderRadius="full"
          overflow="hidden"
        >
          <motion.div
            style={{ scaleY, transformOrigin: "top", width: "100%", height: "100%" }}
          >
            <Box w="100%" h="100%" bg={lineBg} />
          </motion.div>
        </Box>

        {/* Timeline Items */}
        {WORK_EXPERIENCE.map((exp, index) => {
          const isEven = index % 2 === 0;

          return (
            <Flex
              key={index}
              justifyContent={{ base: "flex-end", md: isEven ? "flex-start" : "flex-end" }}
              position="relative"
              w="100%"
              mb={12}
            >
              {/* Dot / Icon */}
              <Box
                position="absolute"
                left={{ base: "20px", md: "50%" }}
                top="20px"
                transform="translateX(-50%)"
                zIndex={2}
                as={motion.div}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.5 } as any}
              >
                <Flex
                  w={{ base: "40px", md: "50px" }}
                  h={{ base: "40px", md: "50px" }}
                  bg={bgToken}
                  boxShadow={outerShadow}
                  borderRadius="full"
                  alignItems="center"
                  justifyContent="center"
                  color={lineBg}
                >
                  <FaBriefcase size={20} />
                </Flex>
              </Box>

              {/* Card Content */}
              <Box
                w={{ base: "calc(100% - 60px)", md: "44%" }}
                as={motion.div}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.3 } as any}
              >
                <Box
                  bg={bgToken}
                  borderRadius="2xl"
                  p={{ base: 5, md: 8 }}
                  boxShadow={outerShadow}
                  transition="all 0.3s ease"
                  _hover={{ boxShadow: innerShadow }}
                >
                  <Text fontSize="2xl" fontWeight="bold" mb={2}>
                    {exp.role}
                  </Text>
                  <Flex justifyContent="space-between" mb={4} flexWrap="wrap" gap={2}>
                    <Text color={lineBg} fontWeight="bold" fontSize="lg">
                      {exp.organization}
                    </Text>
                    <Text fontSize="sm" fontStyle="italic" opacity={0.8} bg={useColorModeValue("blackAlpha.50", "whiteAlpha.50")} px={3} py={1} borderRadius="full">
                      {exp.duration.from} - {exp.duration.to}
                    </Text>
                  </Flex>
                  <UnorderedList pl={4} spacing={2} opacity={0.8}>
                    {exp.keyPoints.map((item, idx) => (
                      <ListItem key={idx} fontSize="md" lineHeight={1.7}>
                        {item}
                      </ListItem>
                    ))}
                  </UnorderedList>
                </Box>
              </Box>
            </Flex>
          );
        })}
      </Box>
    </Wrapper>
  );
}
