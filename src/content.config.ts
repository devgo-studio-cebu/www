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

const blog = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
    schema: ({ image }) => z.object({
        title: z.string(),
        description: z.string().max(160, 'Meta description must be 160 chars or less'),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        author: z.string().default('DEVGO Studio'),
        tags: z.array(z.string()).default([]),
        image: image().optional(),
        draft: z.boolean().default(false),
    })
})

export const collections = { 'case-studies': caseStudies, blog }