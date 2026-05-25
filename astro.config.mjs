// @ts-check
import { defineConfig, fontProviders } from "astro/config"

import tailwindcss from "@tailwindcss/vite"

import sitemap from "@astrojs/sitemap"

import mdx from "@astrojs/mdx"

export default defineConfig({
    site: "https://devgo.studio",

    vite: {
        plugins: [
            tailwindcss(),
        ],
    },

    integrations: [
        sitemap({
            lastmod: new Date(),
            changefreq: "weekly",
            priority: 1.0,
            filter: (page) =>
                !page.startsWith("https://devgo.studio/services/") &&
                !page.startsWith("https://devgo.studio/blog/") &&
                page !== "https://devgo.studio/services/" &&
                page !== "https://devgo.studio/blog/" &&
                page !== "https://devgo.studio/about/",
            serialize(item) {
                if (item.url === "https://devgo.studio/") {
                    return { ...item, priority: 1.0, changefreq: "weekly" }
                }
                if (item.url.includes("/case-studies/")) {
                    return { ...item, priority: 0.7, changefreq: "monthly" }
                }
                if (
                    item.url.includes("/privacy/") ||
                    item.url.includes("/terms/")
                ) {
                    return { ...item, priority: 0.3, changefreq: "yearly" }
                }
                return { ...item, priority: 0.5, changefreq: "weekly" }
            },
        }),
        mdx(),
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
