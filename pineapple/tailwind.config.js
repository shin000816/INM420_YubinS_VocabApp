/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(220 20% 88%)",
        input: "hsl(220 20% 88%)",
        ring: "hsl(243 90% 68%)",
        background: "hsl(216 45% 98%)",
        foreground: "hsl(222 28% 16%)",
        primary: {
          DEFAULT: "hsl(245 84% 62%)",
          foreground: "hsl(0 0% 100%)",
        },
        secondary: {
          DEFAULT: "hsl(245 60% 97%)",
          foreground: "hsl(222 28% 16%)",
        },
        muted: {
          DEFAULT: "hsl(238 35% 94%)",
          foreground: "hsl(228 18% 45%)",
        },
        accent: {
          DEFAULT: "hsl(241 100% 96%)",
          foreground: "hsl(226 72% 44%)",
        },
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(222 28% 16%)",
        },
      },
      borderRadius: {
        xl: "1.5rem",
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      boxShadow: {
        soft: "0 20px 45px rgba(80, 100, 140, 0.12)",
      },
    },
  },
  plugins: [],
};
