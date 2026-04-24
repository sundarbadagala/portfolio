import plugin from "tailwindcss/plugin";
import { colors } from "./colors";

export const cssVarsPlugin = plugin(({ addBase }) => {
  const vars: Record<string, string> = {};

  for (const [palette, shades] of Object.entries(colors)) {
    for (const [shade, value] of Object.entries(shades)) {
      vars[`--color-${palette}-${shade}`] = value as string;
    }
  }

  addBase({ ":root": vars });
});
