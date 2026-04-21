import SkillBar from "@/share/molecule/SkillBar";
import { MY_SKILLS } from "@/helper/constants";
import { Text, Box, useColorModeValue, Grid, GridItem } from "@chakra-ui/react";
import Wrapper from "@/share/organisms/Wrapper";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4 },
  },
};

export default function Skills() {
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
        <Text variant={"H1"} mb={8}>SKILLS</Text>
      </motion.div>
      
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
        gap={8}
      >
        {MY_SKILLS.map((skill, index) => {
          return (
            <GridItem key={index}>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                <Text variant={"H2"} mb={6}>{skill.skillName}</Text>
                <Box
                  bg={sectionBg}
                  borderRadius="2xl"
                  p={8}
                  boxShadow={outerShadow}
                  transition="all 0.3s ease"
                  _hover={{
                    boxShadow: innerShadow
                  }}
                  id='skill-box'
                >
                  {skill.subSkills.map((subSkill, idx: number) => (
                    <motion.div key={idx} variants={itemVariants}>
                      <SkillBar {...subSkill} />
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </GridItem>
          );
        })}
      </Grid>
    </Wrapper>
  );
}
