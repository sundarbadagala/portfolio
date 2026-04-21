import {
  Text,
  Box,
  Grid,
  Image,
  Badge,
  useColorModeValue,
  VStack,
  HStack
} from "@chakra-ui/react";
import Wrapper from "@/share/organisms/Wrapper";
import { PROJECTS } from "@/helper/constants";
import { motion } from "framer-motion";
import { NavLink } from "@/share/atoms/links";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Projects() {
  const sectionBg = "bg";
  const outerShadow = useColorModeValue(
    "8px 8px 16px #c9c7c8, -8px -8px 16px #ffffff",
    "8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.08)"
  );
  const innerShadow = useColorModeValue(
    "inset 6px 6px 12px #c9c7c8, inset -6px -6px 12px #ffffff",
    "inset 6px 6px 12px rgba(0, 0, 0, 0.5), inset -6px -6px 12px rgba(255, 255, 255, 0.08)"
  );

  return (
    <Wrapper>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Text variant={"H1"} mb={8}>PROJECTS</Text>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)"
          }}
          gap={6}
          w="100%"
        >
          {PROJECTS.map((project) => (
            <motion.div key={project.id} variants={itemVariants}>
              <NavLink href={project.link} target="_blank">
                <Box
                  bg={sectionBg}
                  borderRadius="2xl"
                  p={6}
                  boxShadow={outerShadow}
                  transition="all 0.3s ease"
                  _hover={{
                    boxShadow: innerShadow,
                    transform: "translateY(-4px)"
                  }}
                  cursor="pointer"
                  h="100%"
                >
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

                      <Text
                        fontSize="sm"
                        color={useColorModeValue("gray.600", "gray.400")}
                        lineHeight="1.5"
                        whiteSpace="pre-line"
                      >
                        {project.description}
                      </Text>

                      <HStack spacing={2} wrap="wrap">
                        {project.technologies.slice(0, 3).map((tech, index) => (
                          <Badge
                            key={index}
                            colorScheme="blue"
                            variant="subtle"
                            fontSize="xs"
                            px={2}
                            py={1}
                            borderRadius="md"
                          >
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 3 && (
                          <Badge
                            colorScheme="gray"
                            variant="subtle"
                            fontSize="xs"
                            px={2}
                            py={1}
                            borderRadius="md"
                          >
                            +{project.technologies.length - 3}
                          </Badge>
                        )}
                      </HStack>
                    </VStack>
                  </VStack>
                </Box>
              </NavLink>
            </motion.div>
          ))}
        </Grid>
      </motion.div>
    </Wrapper>
  );
}