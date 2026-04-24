import plugin from "tailwindcss/plugin";

export const buttonPlugin = plugin(({ addComponents }) => {
  addComponents({
    ".btn": {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "0.5rem",
      fontWeight: "500",
      transition: "all 150ms ease",
      cursor: "pointer",
      "&:disabled": { opacity: "0.5", cursor: "not-allowed" },
    },
    ".btn-sm": { padding: "0.375rem 0.75rem", fontSize: "0.875rem" },
    ".btn-md": { padding: "0.5rem 1.25rem",   fontSize: "1rem" },
    ".btn-lg": { padding: "0.75rem 1.75rem",  fontSize: "1.125rem" },

    ".btn-primary": {
      backgroundColor: "var(--color-mono-900)",
      color: "var(--color-mono-100)",
      "&:hover":  { backgroundColor: "var(--color-mono-800)" },
      "&:active": { backgroundColor: "var(--color-mono-700)" },
      ".dark &": {
        backgroundColor: "var(--color-mono-200)",
        color: "var(--color-text-900)",
        "&:hover":  { backgroundColor: "var(--color-mono-300)" },
        "&:active": { backgroundColor: "var(--color-mono-400)" },
      },
    },
  });
});
