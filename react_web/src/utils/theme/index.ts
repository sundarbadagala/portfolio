import { MultiSelectTheme } from "chakra-multiselect";
import { extendTheme } from "@chakra-ui/react";
import { colors, colorsScheme } from "./colors";
import { breakpoints } from "./breakpoints";
import { globalStyles } from "./globalStyles";
import { buttonTheme } from "./button";
import { containerTheme } from "./container";
import { textTheme } from "./text";
import { stepperTheme } from "./stepper";
import { inputTheme } from "./input";

export const theme = extendTheme({
  colors: colors,
  semanticTokens: {
    colors: colorsScheme,
  },
  breakpoints,
  fonts: {
    body: "Noto Sans,sans-serif",
  },
  components: {
    Button: buttonTheme,
    Text: textTheme,
    Container: containerTheme,
    MultiSelect: MultiSelectTheme,
    Stepper: stepperTheme,
    Input: inputTheme
  },
  styles: globalStyles,
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
});
