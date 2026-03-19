// @ts-check
import { defineConfig, fontProviders } from "astro/config"

import tailwindcss from "@tailwindcss/vite"

import sitemap from "@astrojs/sitemap"

export default defineConfig({
    site: "https://devgo.studio",

    vite: {
        // @ts-ignore
        plugins: [tailwindcss()],
    },

    integrations: [sitemap()],

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
