import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#111715',
                'background-30': '#1117154d',
                'text': '#E0E0E0',
                'text-30': '#E0E0E04D',
                'primary': '#5FCBA6',
                'primary-30': '#5FCBA64D',
                'secondary': '#337961',
                'secondary-30': '#3379614D',
            },
            backgroundImage: {
                'hero-pattern': "url('/grid.svg')",
            }
        },
    },
    plugins: [],
};
export default config;