import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const variants = {
  default: defineStyle({
    indicator: {
      background: "mono.900 !important",
      _dark: {
        background: "mono.100 !important",
      },
    },
    stepper: {
      color: "blue",
    },
    step: {
      color: "mono.600",
      width: "100%",
      paddingBottom: "24px",
    },
    separator: {
      background: "mono.900 !important",
      _dark: {
        background: "mono.200 !important",
      },
    },
  }),
};

const sizes = {
  md: {
    title: {
      fontSize: ["16px", "20px", "24px"],
      fontWeight: "bold",
      lineHeight: 1.7,
    },
    description: {
      fontSize: "16px",
    },
  },
};

export const stepperTheme = defineStyleConfig({
  sizes,
  variants,
});
