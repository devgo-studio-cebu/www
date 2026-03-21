// @ts-check
import { defineConfig, fontProviders } from "astro/config"

import tailwindcss from "@tailwindcss/vite"

import sitemap from "@astrojs/sitemap"

import mdx from "@astrojs/mdx"

export default defineConfig({
    site: "https://devgo.studio",

    vite: {
        plugins: [
            // @ts-expect-error Tailwind CSS Vite plugin types may not match Astro's Vite config
            tailwindcss(),
        ],
    },

    integrations: [sitemap(), mdx()],

    fonts: [
        {
            provider: fontProviders.local(),
            name: "MonumentExtended",
            cssVariable: "--font-monument-extended",
            options: {
                variants: [
                    {
                        src: [
                            "./src/assets/fonts/MonumentExtended-Regular.otf",
                        ],
                        weight: "400",
                        style: "normal",
                    },
                    {
                        src: [
                            "./src/assets/fonts/MonumentExtended-Ultrabold.otf",
                        ],
                        weight: "800",
                        style: "normal",
                    },
                ],
            },
        },
    ],
})
