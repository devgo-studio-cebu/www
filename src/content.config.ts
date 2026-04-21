import { glob } from "astro/loaders"
import { z } from "astro/zod"
import { defineCollection } from "astro:content"

const caseStudies = defineCollection({
    loader: glob({ pattern: '**/*.(md|mdx)', base: './src/content/case-studies' }),
    schema: ({ image }) => z.object({
        title: z.string(),
        subtitle: z.string(),
        client: z.string(),
        pubDate: z.coerce.date(),
        year: z.number(),
        category: z.enum(['Website Development', 'E-Commerce', 'AI Automation', 'Mobile Development', 'Software Development']),

        services: z.array(z.string()),
        stack: z.array(z.string()),

        image: image().optional(),
        isPrivate: z.boolean().default(false),
        link: z.string().optional(),
    })
})

export const collections = { 'case-studies': caseStudies }