import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // Esto cubre las carpetas con paréntesis
  ],
  theme: {
    extend: {
      colors: {
        // Colores personalizados para AgendaGol
        brand: {
          green: "#22c55e", // Verde fútbol
          dark: "#0f172a",  // Slate oscuro para contraste profesional
        },
      },
    },
  },
  plugins: [],
};
export default config;