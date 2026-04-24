import type { Config } from "tailwindcss";
import { colors } from "./src/theme/colors";
import { fontFamily, fontSize } from "./src/theme/typography";
import { buttonPlugin } from "./src/theme/button";
import { cssVarsPlugin } from "./src/theme/cssVars";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ...colors,
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily,
      fontSize,
    },
  },
  plugins: [cssVarsPlugin, buttonPlugin],
};
export default config;
