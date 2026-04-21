import { defineStyle, defineStyleConfig } from "@chakra-ui/react";
import { colors } from "./colors";

const variants = {
  H1: defineStyle({
    color: colors.text[900],
    fontSize: ["16px", "24px", "32px", "40px"],
    fontWeight: "bold",
    lineHeight: 1.3,
    padding: "12px 0",
    _dark: {
      color: colors.text[100],
    },
  }),
  H2: defineStyle({
    color: colors.text[600],
    fontSize: ["12px", "16px", "24px", "32px"],
    fontWeight: "bold",
    lineHeight: 1.3,
    padding: "8px 0",
    _dark: {
      color: colors.text[300],
    },
  }),
  header: defineStyle({
    color: colors.text[900],
    fontSize: ["12px", "16px", "18px", "24px"],
    fontWeight: "medium",
    lineHeight: 1.3,
    padding: "8px 0",
    _dark: {
      color: colors.text[300],
    },
  }),
  error: defineStyle({
    color: colors.error[600],
    fontSize: "12px",
    _dark: {
      color: colors.error[500],
    },
  }),

  label: defineStyle({
    color: colors.text[600],
    fontSize: "14px",
    _dark: {
      color: colors.text[500],
    },
  }),
};

export const textTheme = defineStyleConfig({ variants });
