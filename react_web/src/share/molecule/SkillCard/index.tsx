import { useState, useRef, useEffect } from "react";
import { Box, Image, Text, Progress, useColorModeValue } from "@chakra-ui/react";
import { useInView } from "framer-motion";

interface IProps {
  skill: string;
  icon: string;
  percentage: number;
}

function SkillCard({ skill, icon, percentage }: IProps) {
  // The 'bg' semantic token maps exactly to the body background color 
  // (mono.200 in light mode, mono.900 in dark mode)
  const cardBg = "bg"; 
  
  // Shadows perfectly calibrated for the specific mono.200 (#ebe8e9) and mono.900 (#000000) backgrounds
  const outerShadow = useColorModeValue(
    "8px 8px 16px #c9c7c8, -8px -8px 16px #ffffff",
    "8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.08)"
  );
  
  const innerShadow = useColorModeValue(
    "inset 6px 6px 12px #c9c7c8, inset -6px -6px 12px #ffffff",
    "inset 6px 6px 12px rgba(0, 0, 0, 0.5), inset -6px -6px 12px rgba(255, 255, 255, 0.08)"
  );

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    if (isInView) {
      // Add a tiny delay so the card has time to render and trigger the transition
      const timer = setTimeout(() => {
        setAnimatedPercentage(percentage);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isInView, percentage]);

  return (
    <Box
      ref={ref}
      bg={cardBg}
      borderRadius="2xl"
      p={6}
      boxShadow={outerShadow}
      transition="all 0.3s ease"
      _hover={{
        boxShadow: innerShadow,
      }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={4}
      w="100%"
      h="100%"
    >
      <Box 
        p={4} 
        borderRadius="full"
        bg={cardBg}
        boxShadow={innerShadow}
      >
        <Image src={icon} alt={skill} boxSize="48px" objectFit="contain" />
      </Box>
      <Text fontWeight="bold" fontSize="md" textAlign="center" noOfLines={1} w="100%">
        {skill}
      </Text>
      <Box w="100%" borderRadius="full" p="2px" bg={cardBg} boxShadow={innerShadow}>
        <Progress 
          value={animatedPercentage} 
          size="sm" 
          colorScheme="blue" 
          borderRadius="full" 
          bg="transparent"
          sx={{
            "& > div": {
              transitionProperty: "width",
              transitionDuration: "1.2s",
              transitionTimingFunction: "ease-out"
            }
          }}
        />
      </Box>
    </Box>
  );
}

export default SkillCard;
