import {
  Text,
  Box,
  Image,
  Badge,
  useColorModeValue,
  VStack,
  HStack,
  Icon
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { NavLink } from "@/share/atoms/links";
import { FaRegCheckCircle } from "react-icons/fa";

interface Project {
  id: number;
  title: string;
  description: string[];
  image: string;
  link: string;
  technologies: string[];
}

interface ProjectCardProps {
  project: Project;
  outerShadow: string;
  innerShadow: string;
  sectionBg: string;
  itemVariants: any;
}

export default function ProjectCard({
  project,
  outerShadow,
  //   innerShadow,
  sectionBg,
  itemVariants
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <>
      <motion.div
        key={project.id}
        variants={itemVariants}
        style={{ minHeight: "300px" }}
      >
        <NavLink href={project.link} target="_blank">
          <Box
            position="relative"
            bg={sectionBg}
            borderRadius="2xl"
            p={6}
            boxShadow={outerShadow}
            transition="all 0.3s ease"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            _hover={{
              // boxShadow: innerShadow,
            //   transform: "translateY(-4px)"
            }}
            cursor="pointer"
            h="100%"
            overflow="hidden"
          >
            {/* Main Card Content */}
            <VStack spacing={4} align="stretch">
              <Box
                borderRadius="xl"
                overflow="hidden"
                bg={useColorModeValue("gray.100", "gray.700")}
                p={4}
                display="flex"
                alignItems="center"
                justifyContent="center"
                minH="120px"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  width="60px"
                  height="60px"
                  objectFit="contain"
                />
              </Box>

              <VStack spacing={3} align="stretch">
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  color={useColorModeValue("gray.800", "gray.100")}
                >
                  {project.title}
                </Text>
                <HStack spacing={2} wrap="wrap">
                  {project.technologies.map((tech, index) => (
                    <Badge
                      key={index}
                      colorScheme="blue"
                      variant="solid"
                      fontSize="xs"
                      px={2}
                      py={1}
                      borderRadius="md"
                    >
                      {tech}
                    </Badge>
                  ))}
                </HStack>
              </VStack>
            </VStack>

            {/* Bottom Sheet Animation */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: isHovered ? 0 : "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: useColorModeValue(
                  "linear-gradient(to top, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95))",
                  "linear-gradient(to top, rgba(45, 55, 72, 0.98), rgba(45, 55, 72, 0.95))"
                ),
                padding: "16px",
                borderRadius: "12px 12px 0 0",
                backdropFilter: "blur(10px)",
                boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.1)"
              }}
            >
              <VStack spacing={3} align="stretch">
                {/* <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color={useColorModeValue("gray.700", "gray.300")}
                >
                  Technologies
                </Text> */}

                <Box pt={2}>
                  {project.description.map((item) => (
                    <Text
                      fontSize="xs"
                      color={useColorModeValue("gray.500", "gray.400")}
                      lineHeight="1.4"
                      mb={1}
                    >
                      <Icon>
                        <FaRegCheckCircle />
                      </Icon>{" "}
                      {item}
                    </Text>
                  ))}
                </Box>
              </VStack>
            </motion.div>
          </Box>
        </NavLink>
      </motion.div>
    </>
  );
}
