import { describe, it, expect } from "bun:test"
import type {
  SEOProps,
  ServiceSchema,
  ReviewSchema,
  FAQSchema,
  BreadcrumbItem,
} from "./seo"

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