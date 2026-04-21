import { useState, useRef, useEffect } from "react";
import { Box, Flex, Text, Progress, useColorModeValue } from "@chakra-ui/react";
import { useInView } from "framer-motion";
import {
  SiReact,
  SiNextdotjs,
  SiJavascript,
  SiTypescript,
  SiHtml5,
  SiCss3,
  SiRedux,
  SiRecoil,
  SiBootstrap,
  SiChakraui,
  SiNodedotjs,
  SiGit,
  SiMui,
  SiStyledcomponents,
  SiMongodb,
  SiExpress,
  SiJira,
  SiMixpanel,
  SiAxios
} from "react-icons/si";
import { RiTailwindCssFill } from "react-icons/ri";
import { FaSass } from "react-icons/fa";

interface IProps {
  skill: string;
  icon: string;
  percentage: number;
}

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  react: SiReact,
  nextdotjs: SiNextdotjs,
  javascript: SiJavascript,
  typescript: SiTypescript,
  html5: SiHtml5,
  css3: SiCss3,
  redux: SiRedux,
  recoil: SiRecoil,
  bootstrap: SiBootstrap,
  chakraui: SiChakraui,
  nodedotjs: SiNodedotjs,
  git: SiGit,
  mui: SiMui,
  tailwind: RiTailwindCssFill,
  styled: SiStyledcomponents,
  sass: FaSass,
  mongo: SiMongodb,
  express: SiExpress,
  jira: SiJira,
  mixpanel:SiMixpanel,
  axios:SiAxios
};

function SkillBar({ skill, icon, percentage }: IProps) {
  const barBg = "bg";
  const textColor = useColorModeValue("mono.800", "mono.100");
  const iconColor = useColorModeValue("blue.600", "blue.300");

  const innerShadow = useColorModeValue(
    "inset 6px 6px 12px #c9c7c8, inset -6px -6px 12px #ffffff",
    "inset 6px 6px 12px rgba(0, 0, 0, 0.5), inset -6px -6px 12px rgba(255, 255, 255, 0.08)"
  );

  const iconShadow = useColorModeValue(
    "4px 4px 8px #c9c7c8, -4px -4px 8px #ffffff",
    "4px 4px 8px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.05)"
  );

  // Determine color scheme based on percentage
  const getColorScheme = (percent: number): string => {
    if (percent < 25) return "orange";
    if (percent < 50) return "yellow";
    if (percent < 75) return "blue";
    return "green";
  };

  const colorScheme = getColorScheme(percentage);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setAnimatedPercentage(percentage);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isInView, percentage]);

  const IconComponent = ICON_MAP[icon] || SiReact;

  return (
    <Box ref={ref} w="100%" mb={4}>
      <Flex align="center" justify="space-between" mb={3}>
        <Flex align="center" gap={4}>
          <Box
            p={3}
            borderRadius="lg"
            bg={barBg}
            boxShadow={iconShadow}
            display="flex"
            alignItems="center"
            justifyContent="center"
            transition="all 0.3s ease"
            _hover={{
              boxShadow: innerShadow
            }}
          >
            <IconComponent size={28} color={iconColor} />
          </Box>
          <Text fontWeight="600" fontSize="md" color={textColor}>
            {skill}
          </Text>
        </Flex>
        <Text
          fontWeight="700"
          fontSize="md"
          color={useColorModeValue("blue.600", "blue.300")}
        >
          {animatedPercentage}%
        </Text>
      </Flex>
      <Box
        w="100%"
        borderRadius="2xl"
        bg={barBg}
        p="4px"
        overflow="hidden"
        boxShadow={innerShadow}
        transition="all 0.3s ease"
      >
        <Progress
          value={animatedPercentage}
          size="md"
          colorScheme={colorScheme}
          borderRadius="xl"
          bg={useColorModeValue("mono.300", "mono.700")}
          sx={{
            "& > div": {
              transitionProperty: "width",
              transitionDuration: "1.2s",
              transitionTimingFunction: "ease-out",
              borderRadius: "xl"
            }
          }}
        />
      </Box>
    </Box>
  );
}

export default SkillBar;
