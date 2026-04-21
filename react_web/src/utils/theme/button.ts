import { defineStyle, defineStyleConfig } from "@chakra-ui/react";
import { colors } from "./colors";

//-----------------------------Variants-----------------------------

const variants = {
  primary: defineStyle({
    bg: colors.mono[700],
    color: colors.mono[200],
    _hover: {
      bg: colors.mono[800],
      _disabled: {
        bg: colors.mono[700],
        opacity: 0.5,
      },
    },
    _active: {
      bg: colors.mono[900],
      _disabled: {
        bg: colors.mono[700],
        opacity: 0.5,
      },
    },
    _disabled: {
      opacity: 0.5,
    },
    _dark: {
      bg: colors.mono[300],
      color: colors.mono[800],
      _hover: {
        bg: colors.mono[200],
        _disabled: {
          bg: colors.mono[600],
          opacity: 1,
        },
      },
      _active: {
        bg: colors.mono[100],
        _disabled: {
          bg: colors.mono[600],
          opacity: 1,
        },
      },
      _disabled: {
        bg: colors.mono[600],
        opacity: 1,
      },
    },
  }),

  secondary: defineStyle({
    border: `1px solid ${colors.mono[700]}`,
    color: colors.mono[700],
    _hover: {
      border: `1px solid ${colors.mono[700]}`,
    },
    _active: {
      border: `1px solid ${colors.mono[700]}`,
    },
    _disabled: {
      opacity: 0.5,
    },
    _dark: {
      border: `1px solid ${colors.mono[200]}`,
      color: colors.mono[200],
      bg: "transparent",
    },
  }),
};

//-----------------------------Sizes-----------------------------
const sizes = {
  sm: defineStyle({
    padding: "4px 6px",
    fontSize: "12px",
  }),

  md: defineStyle({
    padding: "8px 12px",
    fontSize: "14px",
  }),

  block: defineStyle({
    width: "100%",
  }),

  blockSm: defineStyle({
    width: "100%",
    padding: "4px 6px",
    fontSize: "12px",
  }),

  blockMd: defineStyle({
    width: "100%",
    padding: "8px 12px",
    fontSize: "14px",
  }),
};

//-----------------------------Config-----------------------------
export const buttonTheme = defineStyleConfig({ variants, sizes });
