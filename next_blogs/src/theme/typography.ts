export const fontFamily = {
  sans: ["var(--font-geist-sans)", "Arial", "sans-serif"],
  mono: ["var(--font-geist-mono)", "monospace"],
};

export const fontSize: Record<string, [string, { lineHeight: string }]> = {
  xs:    ["0.75rem",  { lineHeight: "1rem" }],
  sm:    ["0.875rem", { lineHeight: "1.25rem" }],
  base:  ["1rem",     { lineHeight: "1.5rem" }],
  md:    ["1.125rem", { lineHeight: "1.75rem" }],
  lg:    ["1.25rem",  { lineHeight: "1.75rem" }],
  xl:    ["1.5rem",   { lineHeight: "2rem" }],
  "2xl": ["1.875rem", { lineHeight: "2.25rem" }],
  "3xl": ["2.25rem",  { lineHeight: "2.5rem" }],
  "4xl": ["3rem",     { lineHeight: "1" }],
  "5xl": ["3.75rem",  { lineHeight: "1" }],
};
