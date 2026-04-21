import { Container as ChakraContainer } from "@chakra-ui/react";

function Container({
  children,
  styles,
  padding,
}: {
  children: React.ReactElement | string | React.ReactNode;
  styles?: object;
  padding?: string;
}) {
  return (
    <ChakraContainer
      size={["base", "sm", "md", "lg", "xl"]}
      fontSize={["12px", "14px", "16px", "18px", "20px"]}
      style={{ ...styles, padding }}
    >
      {children}
    </ChakraContainer>
  );
}

export default Container;
