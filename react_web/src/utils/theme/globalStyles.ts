import { mode } from "@chakra-ui/theme-tools";
import { StyleFunctionProps } from "@chakra-ui/react";
import { colors } from "./colors";

export const globalStyles = {
  global: (props: StyleFunctionProps | Record<string, any>) => ({
    body: {
      color: mode(colors.mono[800], colors.mono[200])(props),
      bg: mode(colors.mono[200], colors.mono[800])(props),
      fontFamily: `"Google Sans Code", monospace`
    },
    h1: {
      fontSize: ["16px", "18px", "22px", "26px", "30px"],
    },
    "*::placeholder": {
      color: mode("gray.400", "whiteAlpha.400")(props),
    },
  }),
};
