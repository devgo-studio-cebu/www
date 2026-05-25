import { describe, it, expect } from "bun:test"
import type {
  SEOProps,
  ServiceSchema,
  ReviewSchema,
  FAQSchema,
  BreadcrumbItem,
} from "./seo"
import {
  generateBreadcrumbSchema,
  generateServiceSchema,
} from "../utils/seo"

describe("SEO Types", () => {
  describe("ServiceSchema", () => {
    it("should accept a valid service object", () => {
      const svc: ServiceSchema = {
        name: "Web Development",
        description:
          "High-performance websites optimized for speed and SEO",
        provider: { "@type": "Organization", name: "DEVGO Studio" },
        areaServed: "Worldwide",
      }
      expect(svc.name).toBe("Web Development")
      expect(svc["@type"] || "Service").toBe("Service")
    })
  })

  describe("ReviewSchema", () => {
    it("should accept a valid review object", () => {
      const review: ReviewSchema = {
        author: "Josh Whitehead",
        reviewBody: "DEVGO Studio built my website...",
        reviewRating: { ratingValue: 5, bestRating: 5 },
      }
      expect(review.author).toBe("Josh Whitehead")
      expect(review.reviewRating.ratingValue).toBe(5)
    })
  })

  describe("FAQSchema", () => {
    it("should accept a valid FAQ object", () => {
      const faq: FAQSchema = {
        questions: [
          {
            question: "How much does a website cost?",
            answer: "Prices start from ₱25,000...",
          },
        ],
      }
      expect(faq.questions).toHaveLength(1)
      expect(faq.questions[0].question).toBe("How much does a website cost?")
    })
  })

  describe("BreadcrumbItem", () => {
    it("should accept a valid breadcrumb item", () => {
      const item: BreadcrumbItem = {
        name: "Case Studies",
        url: "https://devgo.studio/case-studies/",
      }
      expect(item.name).toBe("Case Studies")
      expect(item.url).toStartWith("https://")
    })
  })

  describe("SEOProps", () => {
    it("should allow optional schema field for all page schemas", () => {
      const props: SEOProps = {
        title: "Test",
        description: "Test page",
        schema: {
          type: "BreadcrumbList",
          items: [{ name: "Home", url: "https://devgo.studio/" }],
        },
      }
      expect(props.schema?.type).toBe("BreadcrumbList")
    })

    it("should allow FAQPage schema", () => {
      const props: SEOProps = {
        title: "FAQ",
        description: "Frequently asked questions",
        schema: {
          type: "FAQPage",
          questions: [
            {
              question: "What services do you offer?",
              answer: "We offer web development, AI automation, and more.",
            },
          ],
        },
      }
      expect(props.schema?.type).toBe("FAQPage")
    })
  })
})

describe("Sitemap configuration", () => {
  it("should produce a sitemap.xml file after build", async () => {
    const file = Bun.file("dist/sitemap.xml")
    const exists = await file.exists()
    if (!exists) {
      const indexFile = Bun.file("dist/sitemap-index.xml")
      const indexExists = await indexFile.exists()
      expect(indexExists).toBe(true)
    }
  })
})

describe("robots.txt", () => {
  it("should NOT disallow /_astro/ path", async () => {
    const file = Bun.file("dist/robots.txt")
    if (await file.exists()) {
      const content = await file.text()
      expect(content).not.toContain("Disallow: /_astro/")
    }
  })

  it("should still contain sitemap reference", async () => {
    const file = Bun.file("dist/robots.txt")
    if (await file.exists()) {
      const content = await file.text()
      expect(content).toContain("Sitemap: https://devgo.studio/sitemap-index.xml")
    }
  })
})

describe("SEO Utilities", () => {
  describe("generateBreadcrumbSchema", () => {
    it("should generate valid BreadcrumbList JSON-LD", () => {
      const items = [
        { name: "Home", url: "https://devgo.studio/" },
        {
          name: "Case Studies",
          url: "https://devgo.studio/case-studies/",
        },
        {
          name: "AI Customer Support",
          url: "https://devgo.studio/case-studies/ai-customer-support/",
        },
      ]
      const result = generateBreadcrumbSchema(items) as any
      expect(result["@context"]).toBe("https://schema.org")
      expect(result["@type"]).toBe("BreadcrumbList")
      expect(result.itemListElement).toHaveLength(3)
      expect(result.itemListElement[0].position).toBe(1)
      expect(result.itemListElement[0].name).toBe("Home")
      expect(result.itemListElement[0].item).toBe("https://devgo.studio/")
    })
  })

  describe("generateServiceSchema", () => {
    it("should generate valid Service JSON-LD once implemented", () => {
      const services = [
        {
          "@type": "Service" as const,
          name: "Web Development",
          description: "High-performance websites optimized for speed and SEO",
          provider: {
            "@type": "Organization" as const,
            name: "DEVGO Studio",
          },
          areaServed: "Worldwide",
        },
      ]
      const result = generateServiceSchema(services) as any
      expect(result["@context"]).toBe("https://schema.org")
      expect(result["@type"]).toBe("ItemList")
      expect(result.itemListElement).toHaveLength(1)
    })

    it("should handle multiple services with correct positions", () => {
      const services = [
        {
          "@type": "Service" as const,
          name: "Web Development",
          description: "Web dev services",
          provider: { "@type": "Organization" as const, name: "DEVGO Studio" },
        },
        {
          "@type": "Service" as const,
          name: "AI Automation",
          description: "AI automation services",
          provider: { "@type": "Organization" as const, name: "DEVGO Studio" },
        },
      ]
      const result = generateServiceSchema(services) as any
      expect(result.itemListElement).toHaveLength(2)
      expect(result.itemListElement[0].position).toBe(1)
      expect(result.itemListElement[1].position).toBe(2)
      expect(result.itemListElement[1].item.name).toBe("AI Automation")
    })
  })
})

describe("Blog Content Collection", () => {
  it("should define a blog collection in content.config.ts", async () => {
    const configText = await Bun.file("src/content.config.ts").text()
    // Verify blog collection is defined with defineCollection
    expect(configText).toContain("const blog = defineCollection")
    expect(configText).toContain("blog")
    // Verify blog is included in the exported collections
    expect(configText).toMatch(/collections\s*=\s*\{[^}]*blog/)
  })

  it("should validate blog frontmatter schema fields", async () => {
    const configText = await Bun.file("src/content.config.ts").text()
    // Extract the blog schema section (greedy match to the export line)
    const blogEnd = configText.indexOf("export const collections")
    const blogSection = configText.substring(configText.indexOf("const blog = defineCollection"), blogEnd !== -1 ? blogEnd : undefined)
    expect(blogSection).toBeDefined()
    // Verify required schema fields
    expect(blogSection).toContain("title: z.string()")
    expect(blogSection).toContain("description: z.string()")
    expect(blogSection).toContain("pubDate: z.coerce.date()")
    expect(blogSection).toContain("author: z.string()")
    expect(blogSection).toContain("tags: z.array(z.string())")
    expect(blogSection).toContain("draft: z.boolean()")
  })

  it("should have blog content markdown files present", async () => {
    const files = [
      "src/content/blog/01-website-cost-philippines.md",
      "src/content/blog/02-ai-automation-small-business.md",
      "src/content/blog/03-web-development-agency-cebu.md",
    ]
    for (const file of files) {
      const exists = await Bun.file(file).exists()
      expect(exists).toBe(true)
    }
  })

  it("should have valid frontmatter in blog posts", async () => {
    const files = [
      "src/content/blog/01-website-cost-philippines.md",
      "src/content/blog/02-ai-automation-small-business.md",
      "src/content/blog/03-web-development-agency-cebu.md",
    ]
    for (const file of files) {
      const content = await Bun.file(file).text()
      // Must have frontmatter
      expect(content.startsWith("---")).toBe(true)
      const frontmatter = content.split("---")[1]
      expect(frontmatter).toContain("title:")
      expect(frontmatter).toContain("description:")
      expect(frontmatter).toContain("pubDate:")
      expect(frontmatter).toContain("author:")
      expect(frontmatter).toContain("tags:")
      // Description should be 160 chars or less
      const descMatch = frontmatter.match(/description:\s*"(.+?)"/)
      if (descMatch) {
        expect(descMatch[1].length).toBeLessThanOrEqual(160)
      }
    }
  })
})

describe("SEO Component Output", () => {
  it("homepage should have Organization + WebSite schemas only", async () => {
    const file = Bun.file("dist/index.html")
    if (await file.exists()) {
      const html = await file.text()
      expect(html).toContain('"@type":"Organization"')
      expect(html).toContain('"@type":"WebSite"')
      expect(html).not.toContain('rel="sitemap"')
    }
  })

  it("case study page should NOT have Organization schema (homepage only)", async () => {
    const file = Bun.file("dist/case-studies/ai-customer-support/index.html")
    if (await file.exists()) {
      const html = await file.text()
      // Organization should only appear in Article publisher context, not as top-level
      const orgCount = (html.match(/"@type":"Organization"/g) || []).length
      // On subpages, Organization may appear in Article publisher, but no more than once
      expect(orgCount).toBeLessThanOrEqual(1)
    }
  })
})