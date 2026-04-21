import { defineStyle, defineStyleConfig } from "@chakra-ui/react";
import { breakpoints } from "./breakpoints";

const sizes = {
  base: defineStyle({
    maxW: breakpoints.base,
  }),
  sm: defineStyle({
    maxW: breakpoints.sm,
  }),
  md: defineStyle({
    maxW: breakpoints.md,
  }),
  lg: defineStyle({
    maxW: breakpoints.lg,
  }),
  xl: defineStyle({
    maxW: breakpoints.xl,
  }),
  "2xl": defineStyle({
    maxW: breakpoints["2xl"],
  }),
};

export const containerTheme = defineStyleConfig({ sizes });
