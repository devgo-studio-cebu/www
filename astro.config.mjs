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

    integrations: [
        sitemap({
            changefreq: 'weekly',
            priority: 0.7,
            lastmod: new Date(),
            filter: (page) => !page.includes('/draft/') && !page.includes('/private/'),
            customPages: [
                'https://devgo.studio/',
                'https://devgo.studio/about',
                'https://devgo.studio/services',
                'https://devgo.studio/contact',
            ],
            serialize(item) {
                if (item.url.includes('about')) {
                    item.priority = 0.9
                }
                if (item.url.includes('services')) {
                    item.priority = 0.8
                }
                return item
            },
        }),
    ],

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
