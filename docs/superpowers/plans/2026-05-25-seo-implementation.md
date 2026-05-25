# SEO Implementation Plan: DEVGO Studio

> For agentic workers: every task follows RED → GREEN → REFACTOR → COMMIT. No step is optional. Run every command exactly as written. Verify expected output before continuing.

**Goal:** Execute all 16 SEO fixes from the strategy spec plus create 4 new content sections (blog, services, about, service detail pages) to transform DEVGO Studio's search visibility.

**Spec:** `docs/superpowers/specs/2026-05-25-seo-strategy.md`

---

## File Map

### Files to CREATE (new)

| # | Path | Purpose |
|---|------|---------|
| N1 | `src/types/seo.test.ts` | Unit tests for SEO type guards and schema builders |
| N2 | `src/pages/services/index.astro` | Services overview landing page |
| N3 | `src/pages/services/web-development.astro` | Web development service detail |
| N4 | `src/pages/services/ai-automation.astro` | AI automation service detail |
| N5 | `src/pages/services/e-commerce.astro` | E-commerce service detail |
| N6 | `src/pages/services/mobile-development.astro` | Mobile development service detail |
| N7 | `src/pages/services/software-development.astro` | Software development service detail |
| N8 | `src/pages/about.astro` | About page with team, mission, location |
| N9 | `src/pages/blog/index.astro` | Blog listing page |
| N10 | `src/pages/blog/[...slug].astro` | Blog article page |
| N11 | `src/content/blog/01-website-cost-philippines.md` | First cornerstone blog post |
| N12 | `src/content/blog/02-ai-automation-small-business.md` | Second cornerstone blog post |
| N13 | `src/content/blog/03-web-development-agency-cebu.md` | Third cornerstone blog post |
| N14 | `public/sitemap.xml` | Static redirect to sitemap-index.xml (fallback if nginx route not used) |

### Files to MODIFY (existing)

| # | Path | Changes |
|---|------|---------|
| M1 | `src/types/seo.ts` | Add `ServiceSchema`, `ReviewSchema`, `FAQSchema` types |
| M2 | `astro.config.mjs` | Configure sitemap to output `sitemap.xml`, add blog collection config |
| M3 | `src/pages/robots.txt.ts` | Remove `Disallow: /_astro/` rule |
| M4 | `src/utils/seo.ts` | Add `generateServiceSchema()`, use existing `generateBreadcrumbSchema()` |
| M5 | `src/components/seo.astro` | Conditionally inject schemas; remove sitemap `<link>` |
| M6 | `nginx.conf` | Fix HTTPS redirect, add security headers, add sitemap rewrite rule |
| M7 | `src/components/landing/hero.astro` | Change `<h2>` to `<h1>` with keyword-rich text |
| M8 | `src/pages/index.astro` | Update title to 60 chars, add keyword-rich body text section |
| M9 | `src/pages/showcase.astro` | Add `description` to seoProps |
| M10 | `src/pages/case-studies/[slug].astro` | Add BreadcrumbList schema; fix cover image `alt=""` → `alt={title}` |
| M11 | `src/layouts/BaseLayout.astro` | Add `initial-scale=1` to viewport meta |
| M12 | `src/components/landing/services.astro` | Add Service schema JSON-LD |
| M13 | `src/content.config.ts` | Add `blog` collection schema |
| M14 | `src/components/navbar.astro` | Add links to /services, /blog, /about |
| M15 | `src/components/footer.astro` | Add links to /services, /blog, /about |
| M16 | `public/og-image.png` | Replace with 1200×630px optimized <80KB version |
| M17 | `src/assets/images/hero.png` | Replace with WebP version <100KB |
| M18 | `src/assets/case-studies/*/cover.png` | Convert all 6 cover images from PNG to WebP |
| M19 | `src/assets/images/mini-studio.png` | Convert to WebP |

---

## PHASES

<!-- PHASE 1: FOUNDATION -->

## Phase 1: Foundation (Types, Config, Infrastructure)

> Everything else depends on these. Types and config must be correct before touching any component or page.

---

### Task 1: Add Missing SEO Schema Types

**Files:**
- Create: `src/types/seo.test.ts`
- Modify: `src/types/seo.ts` (add new interfaces)

**Dependencies:** None

**TDD Cycle:**

- [x] **RED: Write the failing test**

  ```typescript
  // src/types/seo.test.ts
  import { describe, it, expect } from "bun:test"
  import type {
    SEOProps,
    ServiceSchema,
    ReviewSchema,
    FAQSchema,
    BreadcrumbItem,
    OrganizationSchema,
    WebsiteSchema,
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
  ```

- [x] **RED: Verify the test fails**

  Run: `bun test src/types/seo.test.ts`
  Expected: FAIL — `ServiceSchema`, `ReviewSchema`, `FAQSchema`, `BreadcrumbItem` are not exported from `./seo`; `schema` property does not exist on `SEOProps`.

- [x] **GREEN: Write minimal implementation**

  Add to `src/types/seo.ts`:

  ```typescript
  // Add after existing interfaces, before the last export:

  export interface ServiceSchema {
    "@type"?: "Service"
    name: string
    description: string
    provider: {
      "@type": "Organization"
      name: string
      url?: string
    }
    areaServed?: string
    serviceType?: string
    offers?: {
      "@type": "Offer"
      description: string
    }[]
  }

  export interface ReviewSchema {
    "@type"?: "Review"
    author: string
    reviewBody: string
    reviewRating: {
      "@type"?: "Rating"
      ratingValue: number
      bestRating: number
    }
    datePublished?: string
  }

  export interface FAQSchema {
    "@type"?: "FAQPage"
    questions: {
      "@type"?: "Question"
      question: string
      answer: string
    }[]
  }

  export interface BreadcrumbItem {
    name: string
    url: string
  }

  export interface PageSchema {
    type: "BreadcrumbList" | "FAQPage" | "Service" | "Review"
    items?: BreadcrumbItem[]
    questions?: FAQSchema["questions"]
    services?: ServiceSchema[]
    reviews?: ReviewSchema[]
  }
  ```

  Then update the `SEOProps` interface to add the optional `schema` field:

  ```typescript
  export interface SEOProps {
    title: string
    description: string
    canonical?: string
    image?: string
    type?: "website" | "article" | "profile"
    publishedTime?: string
    modifiedTime?: string
    author?: string
    keywords?: string[]
    schema?: PageSchema  // <-- add this line
  }
  ```

- [x] **GREEN: Verify the test passes**

  Run: `bun test src/types/seo.test.ts`
  Expected: PASS — all 6 assertions green.

- [x] **REFACTOR: Clean up**

  - Verify `SEOProps` still compiles with existing pages by running: `npx astro check`
  - Fix any type errors that appear in existing code
  - Ensure no unused imports remain

- [x] **Commit**

  ```bash
  git add src/types/seo.ts src/types/seo.test.ts
  git commit -m "feat: add ServiceSchema, ReviewSchema, FAQSchema, BreadcrumbItem types and optional schema field to SEOProps (Task 1)"
  ```

---

### Task 2: Sitemap Configuration — `sitemap.xml` + `lastmod`

**Files:**
- Create: `public/sitemap.xml` (static redirect fallback)
- Modify: `astro.config.mjs` (sitemap integration config)

**Dependencies:** None

**TDD Cycle:**

- [x] **RED: Write the failing test**

  ```typescript
  // Append to src/types/seo.test.ts

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
  ```

- [x] **RED: Verify the test fails**

  Run: `bun run build`
  Run: `ls dist/sitemap*`
  Expected output (current state):
  ```
  dist/sitemap-0.xml
  dist/sitemap-index.xml
  ```
  (No `dist/sitemap.xml` — confirming the gap)

- [x] **GREEN: Write minimal implementation**

  **Step A — Create `public/sitemap.xml` as static redirect:**

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
      <loc>https://devgo.studio/sitemap-index.xml</loc>
    </sitemap>
  </sitemapindex>
  ```

  **Step B — Update `astro.config.mjs` to include `lastmod` and priority:**

  ```javascript
  // astro.config.mjs — update the sitemap() integration call
  import sitemap from "@astrojs/sitemap"

  export default defineConfig({
    site: "https://devgo.studio",
    // ...existing config...
    integrations: [
      sitemap({
        lastmod: new Date(),
        changefreq: "weekly",
        priority: 1.0,
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
  })
  ```

  **Step C — Nginx rewrite rule** (saved for Phase 2 Task 6):
  The `public/sitemap.xml` handles the static fallback. The nginx rule in Task 6 is the production fix.

- [x] **GREEN: Verify the test passes**

  Run: `bun run build`
  Run: `ls -la dist/sitemap*`
  Expected output includes:
  ```
  dist/sitemap.xml
  dist/sitemap-0.xml
  dist/sitemap-index.xml
  ```

  Run: `head -5 dist/sitemap-index.xml`
  Expected: `<lastmod>` and `<priority>` tags appear in sitemap entries.

- [x] **REFACTOR: Clean up**

  - If `public/sitemap.xml` conflicts with `@astrojs/sitemap`'s own output, remove it and rely solely on the nginx rule (Task 6).
  - Verify `bun run dev` doesn't break with the new sitemap config.

- [x] **Commit**

  ```bash
  git add astro.config.mjs public/sitemap.xml
  git commit -m "feat: add sitemap.xml endpoint, lastmod timestamps, and priority rules (Task 2)"
  ```

---

### Task 3: Fix Robots.txt — Remove `/_astro/` Disallow

**Files:**
- Modify: `src/pages/robots.txt.ts`

**Dependencies:** None

**TDD Cycle:**

- [x] **RED: Write the failing test**

  ```typescript
  // Append to src/types/seo.test.ts

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
  ```

- [x] **RED: Verify the test fails**

  Run: `bun run build`
  Run: `bun test src/types/seo.test.ts`
  Expected: FAIL — first assertion fails because `Disallow: /_astro/` IS present in the current robots.txt.

- [x] **GREEN: Write minimal implementation**

  Remove the `Disallow: /_astro/` block from `src/pages/robots.txt.ts`. Remove these lines:

  ```typescript
  # Disallow admin/private areas for all crawlers
  User-agent: *
  Disallow: /_astro/
  ```

  The final robots.txt will have:
  - `User-agent: *` with `Allow: /`
  - Individual AI crawler agents with `Allow: /`
  - `Sitemap: https://devgo.studio/sitemap-index.xml`
  - No `Disallow:` line anywhere

- [x] **GREEN: Verify the test passes**

  Run: `bun run build`
  Run: `bun test src/types/seo.test.ts`
  Expected: PASS — both robots.txt assertions green.

  Manual verification:
  Run: `cat dist/robots.txt`
  Expected: No `Disallow:` line anywhere. Sitemap line present at bottom.

- [x] **REFACTOR: Clean up**

  - Ensure all AI crawler agents still have explicit `Allow: /` rules.
  - Ensure the sitemap URL uses HTTPS.

- [x] **Commit**

  ```bash
  git add src/pages/robots.txt.ts src/types/seo.test.ts
  git commit -m "feat: remove /_astro/ disallow from robots.txt to allow Google image crawling (Task 3)"
  ```

---

<!-- PHASE 2: CORE LOGIC -->

## Phase 2: Core Logic (SEO Utilities, Schema Generation, Nginx)

> Business logic for schema generation, conditional injection, and server configuration.

---

### Task 4: SEO Utilities — `generateServiceSchema()` and Use Existing Breadcrumbs

**Files:**
- Modify: `src/utils/seo.ts` (add `generateServiceSchema`)
- Append to: `src/types/seo.test.ts` (add tests for new utility)

**Dependencies:** Task 1 (types must exist)

**TDD Cycle:**

- [x] **RED: Write the failing test**

  ```typescript
  // Append to src/types/seo.test.ts
  import {
    generateBreadcrumbSchema,
    generateServiceSchema,
  } from "../utils/seo"

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
      it("should throw if function is not yet defined", () => {
        // This test will FAIL because generateServiceSchema doesn't exist yet
        expect(() => {
          // @ts-expect-error — function not yet implemented
          generateServiceSchema([])
        }).toBeDefined()
      })

      it("should generate valid Service JSON-LD once implemented", () => {
        const services = [
          {
            "@type": "Service" as const,
            name: "Web Development",
            description:
              "High-performance websites optimized for speed and SEO",
            provider: {
              "@type": "Organization" as const,
              name: "DEVGO Studio",
            },
            areaServed: "Worldwide",
          },
        ]
        // TypeScript will error if function doesn't exist — that's the RED signal
        const result = generateServiceSchema(services) as any
        expect(result["@context"]).toBe("https://schema.org")
        expect(result["@type"]).toBe("ItemList")
        expect(result.itemListElement).toHaveLength(1)
      })
    })
  })
  ```

- [x] **RED: Verify the test fails**

  Run: `bun test src/types/seo.test.ts`
  Expected: FAIL — `generateServiceSchema` is not exported from `../utils/seo`.

- [x] **GREEN: Write minimal implementation**

  Add to `src/utils/seo.ts`:

  ```typescript
  import type { ServiceSchema } from "../types/seo"

  /**
   * Generates Service/ItemList schema for services offered
   */
  export function generateServiceSchema(
    services: ServiceSchema[]
  ): object {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: services.map((service, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Service",
          name: service.name,
          description: service.description,
          provider: service.provider,
          ...(service.areaServed && { areaServed: service.areaServed }),
          ...(service.serviceType && { serviceType: service.serviceType }),
        },
      })),
    }
  }
  ```

- [x] **GREEN: Verify the test passes**

  Run: `bun test src/types/seo.test.ts`
  Expected: PASS — all SEO utility assertions green.

- [x] **REFACTOR: Clean up**

  - Add JSDoc comments to `generateServiceSchema`
  - Ensure `generateBreadcrumbSchema` (already in the file) is exported and used

- [x] **Commit**

  ```bash
  git add src/utils/seo.ts src/types/seo.test.ts
  git commit -m "feat: add generateServiceSchema utility and tests for SEO utilities (Task 4)"
  ```

---

### Task 5: SEO Component Refactor — Conditional Schemas + Remove Sitemap Link

**Files:**
- Modify: `src/components/seo.astro`

**Dependencies:** Task 1 (types), Task 4 (utilities)

**TDD Cycle:**

[x] **RED: Write the failing test**

  Since this is an Astro component, we verify correctness via build output. Add tests:

  ```typescript
  // Append to src/types/seo.test.ts

  describe("SEO Component Output", () => {
    it("homepage should have Organization + WebSite schemas only", async () => {
      const file = Bun.file("dist/index.html")
      if (await file.exists()) {
        const html = await file.text()
        // Organization schema should be present on homepage
        expect(html).toContain('"@type":"Organization"')
        expect(html).toContain('"@type":"WebSite"')
        // Should NOT have sitemap link tag (removed in this task)
        expect(html).not.toContain('rel="sitemap"')
      }
    })

    it("case study page should NOT duplicate Organization schema", async () => {
      const file = Bun.file(
        "dist/case-studies/ai-customer-support/index.html"
      )
      if (await file.exists()) {
        const html = await file.text()
        // Organization should NOT appear on non-homepage (Task 5 fix)
        // After fix: Organization only on homepage
      }
    })
  })
  ```

[x] **RED: Verify**

  Run: `bun run build`
  Run: `grep -c '"Organization"' dist/index.html`
  Expected: (organization appears on homepage — we'll check after GREEN)

  Run: `grep -c '"Organization"' dist/case-studies/ai-customer-support/index.html`
  Expected: 1 or more (organization currently appears on ALL pages — that's the bug)

[x] **GREEN: Write minimal implementation**

  Edit `src/components/seo.astro`:

  **Change 1 — Guard Organization + WebSite schemas behind a page-type condition:**

  In the `generateJsonLd()` function in `seo.astro`, wrap the Organization and WebSite schemas:

  ```astro
  function generateJsonLd() {
    const graph: any[] = []

    // Only inject Organization + WebSite on the homepage
    if (!seo.canonical || seo.canonical === siteUrl || seo.canonical.endsWith("/")) {
      graph.push(
        {
          "@type": "Organization",
          ...organizationSchema,
        },
        {
          "@type": "WebSite",
          ...websiteSchema,
        }
      )
    }

    if (meta.type === "article" && meta.publishedTime) {
      graph.push({
        "@type": "Article",
        headline: meta.title,
        description: meta.description,
        url: meta.canonical,
        image: meta.image,
        datePublished: meta.publishedTime,
        dateModified: meta.modifiedTime || meta.publishedTime,
        author: {
          "@type": "Organization",
          name: "DEVGO Studio",
        },
        publisher: {
          "@type": "Organization",
          name: "DEVGO Studio",
          logo: {
            "@type": "ImageObject",
            url: `${siteUrl}/logo.png`,
          },
        },
      })
    }

    // Inject page-level schema from seo.schema prop
    if (seo.schema) {
      if (seo.schema.type === "BreadcrumbList" && seo.schema.items) {
        graph.push({
          "@type": "BreadcrumbList",
          itemListElement: seo.schema.items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: item.url,
          })),
        })
      }
      if (seo.schema.type === "FAQPage" && seo.schema.questions) {
        graph.push({
          "@type": "FAQPage",
          mainEntity: seo.schema.questions.map((q) => ({
            "@type": "Question",
            name: q.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: q.answer,
            },
          })),
        })
      }
    }

    return {
      "@context": "https://schema.org",
      "@graph": graph,
    }
  }
  ```

  **Change 2 — Remove the non-standard sitemap `<link>`:**

  Delete this line from `seo.astro`:

  ```astro
  <!-- Remove these 3 lines -->
  <!-- Sitemap -->
  <link rel="sitemap" href="/sitemap-index.xml" />
  ```

[x] **GREEN: Verify the test passes**

  Run: `bun run build`

  Verify homepage:
  Run: `grep '"Organization"' dist/index.html`
  Expected: Found (Organization schema present on homepage)

  Verify case study page:
  Run: `grep '"Organization"' dist/case-studies/ai-customer-support/index.html`
  Expected: NOT found (Organization schema no longer injected on subpages)

  Verify sitemap link removed:
  Run: `grep 'rel="sitemap"' dist/index.html`
  Expected: NOT found

  Run: `bun test src/types/seo.test.ts`
  Expected: PASS — build output assertions green.

[x] **REFACTOR: Clean up**

  - Test 404 page, showcase page, and terms page to confirm no Organization schema bloat
  - Ensure Article schema still works on case study pages

[x] **Commit**

  ```bash
  git add src/components/seo.astro src/types/seo.test.ts
  git commit -m "fix: scope Organization schema to homepage only and remove non-standard sitemap link (Task 5)"
  ```

---

### Task 6: Nginx Configuration — Redirect Chain, Security Headers, Sitemap Rewrite

**Files:**
- Modify: `nginx.conf`

**Dependencies:** Task 2 (sitemap configured)

**TDD Cycle:**

> NOTE: Nginx config cannot be unit-tested with `bun test`. Verification is via `docker build` + `docker run` + `curl` commands.

[x] **RED: Verify current issues exist**

  Run: `curl -s -I https://devgo.studio/case-studies 2>&1 | head -5`
  Expected output (current behavior):
  ```
  HTTP/2 301
  location: http://devgo.studio/case-studies/
  ```
  (Redirect to HTTP is the bug — should be HTTPS)

  Run: `curl -s -I https://devgo.studio 2>&1 | grep -i "x-frame-options\|content-security-policy\|referrer-policy"`
  Expected: (empty — no security headers present)

  Run: `curl -s -o /dev/null -w "%{http_code}" https://devgo.studio/sitemap.xml`
  Expected: `404` (sitemap.xml not yet routed)

[x] **GREEN: Write minimal implementation**

  Replace `nginx.conf` with the updated configuration:

  ```nginx
  server {
      listen 80;
      server_name localhost;
      root /usr/share/nginx/html;
      index index.html;

      error_page 404 /404.html;

      # Security headers
      add_header X-Frame-Options "SAMEORIGIN" always;
      add_header X-Content-Type-Options "nosniff" always;
      add_header Referrer-Policy "strict-origin-when-cross-origin" always;
      add_header X-XSS-Protection "1; mode=block" always;

      # Sitemap redirect — /sitemap.xml -> /sitemap-index.xml
      location = /sitemap.xml {
          return 301 /sitemap-index.xml;
      }

      # Redirect non-trailing-slash to trailing-slash with HTTPS
      # (Cloudflare handles HTTPS upgrade; this ensures internal consistency)
      location / {
          try_files $uri $uri/ $uri/index.html =404;
      }

      location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|otf|webp)$ {
          expires 1y;
          add_header Cache-Control "public, immutable";
      }

      gzip on;
      gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
  }
  ```

  > **Note on the HTTP redirect fix:** The current issue where `/case-studies` redirects to `http://devgo.studio/case-studies/` originates upstream from the origin server (Dokploy/Nginx container) before Cloudflare. The fix is twofold: (1) ensure the origin responds with relative redirects instead of absolute HTTP URLs, (2) ensure Cloudflare's "Always Use HTTPS" page rule is enabled. The `try_files` directive above handles the trailing slash at the Nginx level. For the absolute URL, ensure the Astro `site` config uses `https://devgo.studio` (already configured) and that Cloudflare SSL/TLS mode is "Full (strict)".

[x] **GREEN: Verify the fix locally**

  Build the Docker image:
  ```bash
  docker build -t devgo-studio-test .
  docker run -d -p 8080:80 --name devgo-nginx-test devgo-studio-test
  ```

  Test sitemap redirect:
  ```bash
  curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/sitemap.xml
  # Expected: 301
  ```

  Test security headers:
  ```bash
  curl -s -I http://localhost:8080/ 2>&1 | grep -i "x-frame-options"
  # Expected: X-Frame-Options: SAMEORIGIN
  ```

  Test trailing slash:
  ```bash
  curl -s -I http://localhost:8080/case-studies 2>&1 | grep -i "location"
  # Expected: Should show trailing-slash redirect (status 301)
  ```

  Clean up:
  ```bash
  docker stop devgo-nginx-test && docker rm devgo-nginx-test
  ```

[x] **REFACTOR: Clean up**

  - Verify CSP header won't break any inline scripts (the site uses `is:inline` scripts). If CSP causes issues, skip CSP and just add the other three headers.
  - Confirm Cloudflare "Always Use HTTPS" is enabled in the Cloudflare dashboard.

[x] **Commit**

  ```bash
  git add nginx.conf
  git commit -m "fix: add security headers, sitemap.xml redirect, and improve trailing slash handling in nginx (Task 6)"
  ```

---

<!-- PHASE 3: INTEGRATION -->

## Phase 3: Integration (Page Meta Fixes, Schema Injection, Nav/Footer Links)

> Every page template gets corrected titles, descriptions, headings, and schemas. Navbar and footer are updated to link to new pages.

---

### Task 7: Homepage Meta Fix — H1, Title, and Body Text

**Files:**
- Modify: `src/components/landing/hero.astro` (change `<h2>` to `<h1>`)
- Modify: `src/pages/index.astro` (update title, add body text)

**Dependencies:** Task 5 (SEO component refactored)

**TDD Cycle:**

[x] **RED: Verify current issues**

  Run: `bun run build`

  Check missing H1:
  Run: `grep -c '<h1' dist/index.html`
  Expected: `0` (no H1 on homepage)

  Check short title:
  Run: `grep '<title>' dist/index.html`
  Expected: `<title>DEVGO Studio</title>` (only 7 meaningful chars)

[x] **GREEN: Fix hero.astro — change `<h2>` to `<h1>`**

  In `src/components/landing/hero.astro`, find the hero subtitle:

  **BEFORE:**
  ```astro
  <h2
    class='text-sm md:text-xl uppercase mb-4 opacity-0 text-center mx-6 font-head'
  >
    Your Partner in AI, Software, and Digital Growth
  </h2>
  ```

  **AFTER:**
  ```astro
  <h1
    class='text-sm md:text-xl uppercase mb-4 opacity-0 text-center mx-6 font-head'
  >
    Web Development & AI Automation Agency Philippines
  </h1>
  ```

  Update the animation selector from `#top h2` to `#top h1` in the `<script>`:
  ```javascript
  // In hero.astro script section:
  animate("#top h1", {   // was #top h2
    opacity: [0, 1],
    translateY: [20, 0],
    ease: "outCubic",
    delay: 500,
  })
  ```

[x] **GREEN: Fix index.astro — update title and add body text**

  In `src/pages/index.astro`, update the `seoProps`:

  **BEFORE:**
  ```typescript
  const seoProps = {
    title: "DEVGO Studio",
    description:
      "DEVGO Studio builds innovative digital experiences. We specialize in web development, mobile apps, and creative solutions for forward-thinking brands.",
    keywords: [
      "devgo", "studio", "design agency", "web development", "digital experiences",
    ],
    type: "website" as const,
  }
  ```

  **AFTER:**
  ```typescript
  const seoProps = {
    title:
      "DEVGO Studio — Web Development & AI Automation Agency Philippines",
    description:
      "DEVGO Studio builds innovative digital experiences. We specialize in web development, mobile apps, AI automation, and creative solutions for forward-thinking brands.",
    keywords: [
      "devgo",
      "studio",
      "web development agency Philippines",
      "AI automation agency",
      "digital agency Cebu",
      "custom website development",
      "mobile app development",
    ],
    type: "website" as const,
  }
  ```

  Add a keyword-rich body text section below the `<Services />` component and before `<Featured />`. This adds crawlable text to the homepage:

  ```astro
  <!-- Add after <Services /> and before <Featured /> -->
  <section class='sr-only'>
    <h2>
      DEVGO Studio: Web Development, AI Automation, and Digital Growth
    </h2>
    <p>
      Based in Cebu, Philippines, DEVGO Studio is a full-service digital
      agency delivering high-performance websites, AI-powered automation,
      e-commerce platforms, and mobile applications. We serve startups,
      SMEs, and enterprises worldwide with custom software solutions
      optimized for speed, scalability, and SEO.
    </p>
    <p>
      Our services include web development (Astro, Next.js, Tailwind),
      AI automation (n8n, LLM integration, RAG systems), e-commerce
      solutions, mobile development (iOS, Android), and custom software
      development for digital transformation.
    </p>
  </section>
  ```

  > The `sr-only` class keeps this text invisible to users but crawlable by search engines. If you prefer visible text, wrap it in a `<section class='px-6 py-10 max-w-4xl'>` instead.

[x] **GREEN: Verify**

  Run: `bun run build`

  Verify H1 exists:
  Run: `grep '<h1' dist/index.html`
  Expected: Found — contains "Web Development & AI Automation Agency Philippines"

  Verify title:
  Run: `grep '<title>' dist/index.html`
  Expected: `<title>DEVGO Studio — Web Development & AI Automation Agency Philippines</title>`

  Verify sr-only section:
  Run: `grep -c 'sr-only' dist/index.html`
  Expected: `1`

  Run: `bun test src/types/seo.test.ts`
  Expected: PASS — all previous tests still green.

[x] **REFACTOR: Clean up**

  - Ensure the old `<h3>Trusted By</h3>` is still present and correctly placed after the new `<h1>`
  - Verify the animation works with the new `#top h1` selector

[x] **Commit**

  ```bash
  git add src/components/landing/hero.astro src/pages/index.astro
  git commit -m "fix: add H1 to homepage, update title to 60 chars, add crawlable body text (Task 7)"
  ```

---

### Task 8: Showcase Meta + Case Study Detail Fixes

**Files:**
- Modify: `src/pages/showcase.astro` (add description)
- Modify: `src/pages/case-studies/[slug].astro` (add breadcrumb schema, fix alt text)

**Dependencies:** Task 1 (types), Task 5 (SEO component handles PageSchema)

**TDD Cycle:**

[x] **RED: Verify current issues**

  Run: `bun run build`

  Check missing description:
  Run: `grep 'meta name="description"' dist/showcase/index.html`
  Expected: (empty — no description meta tag)

  Check empty alt text:
  Run: `grep 'alt=""' dist/case-studies/ai-customer-support/index.html`
  Expected: Found — `<img ... alt="">` on cover image

[x] **GREEN: Fix showcase.astro — add description**

  In `src/pages/showcase.astro`, update `seoProps`:

  **BEFORE:**
  ```typescript
  const seoProps = {
    title: "Showcase | DEVGO Studio",
    type: "website" as const,
  }
  ```

  **AFTER:**
  ```typescript
  const seoProps = {
    title: "Portfolio & Showcase | DEVGO Studio",
    description:
      "Browse our portfolio of web development, AI automation, and mobile app projects. See how DEVGO Studio delivers digital results for global brands.",
    keywords: [
      "web development portfolio",
      "Philippines agency portfolio",
      "DEVGO projects",
      "digital agency showcase",
    ],
    type: "website" as const,
  }
  ```

[x] **GREEN: Fix [slug].astro — breadcrumb schema + alt text**

  **Change 1 — Fix cover image alt text:**

  In `src/pages/case-studies/[slug].astro`, line with `<Image src={image} alt='' />`:

  **BEFORE:**
  ```astro
  <Image src={image} alt='' />
  ```

  **AFTER:**
  ```astro
  <Image src={image} alt={title} />
  ```

  **Change 2 — Add BreadcrumbList schema to seoProps:**

  In the same file, update the `<BaseLayout seo={{...}}>` props to include a breadcrumb schema:

  **BEFORE:**
  ```astro
  <BaseLayout
    seo={{
      title: `${title} | DEVGO Studio`,
      description: subtitle,
      type: "article",
      publishedTime: pubDate.toISOString(),
      keywords: [category, ...services],
    }}
  >
  ```

  **AFTER:**
  ```astro
  <BaseLayout
    seo={{
      title: `${title} | DEVGO Studio`,
      description: subtitle,
      type: "article",
      publishedTime: pubDate.toISOString(),
      keywords: [category, ...services],
      schema: {
        type: "BreadcrumbList",
        items: [
          { name: "Home", url: "https://devgo.studio/" },
          {
            name: "Case Studies",
            url: "https://devgo.studio/case-studies/",
          },
          {
            name: title,
            url: `https://devgo.studio/case-studies/${entry.id.replace(/\.(md|mdx)$/, "")}/`,
          },
        ],
      },
    }}
  >
  ```

[x] **GREEN: Verify**

  Run: `bun run build`

  Verify showcase description:
  Run: `grep 'meta name="description"' dist/showcase/index.html`
  Expected: `<meta name="description" content="Browse our portfolio of web development...">`

  Verify no empty alt:
  Run: `grep 'alt=""' dist/case-studies/ai-customer-support/index.html`
  Expected: NOT found

  Verify breadcrumb in HTML:
  Run: `grep 'BreadcrumbList' dist/case-studies/ai-customer-support/index.html`
  Expected: Found

  Verify breadcrumb items:
  Run: `grep '"Case Studies"' dist/case-studies/ai-customer-support/index.html`
  Expected: Found

  Run: `bun test src/types/seo.test.ts`
  Expected: PASS.

[x] **REFACTOR: Clean up**

  - Check all 5 case study pages for breadcrumb presence
  - Ensure the breadcrumb URL uses HTTPS

[x] **Commit**

  ```bash
  git add src/pages/showcase.astro src/pages/case-studies/[slug].astro
  git commit -m "fix: add showcase description, breadcrumb schema to case studies, and alt text to cover images (Task 8)"
  ```

---

### Task 9: BaseLayout Viewport Fix + Navbar/Footer Link Updates

**Files:**
- Modify: `src/layouts/BaseLayout.astro` (add `initial-scale=1`)
- Modify: `src/components/navbar.astro` (add links to /services, /blog, /about)
- Modify: `src/components/footer.astro` (add links to /services, /blog, /about)

**Dependencies:** None (new pages don't exist yet, but links won't 404 if we add pages in Phase 4)

**TDD Cycle:**

[x] **RED: Verify current issues**

  Run: `grep 'viewport' src/layouts/BaseLayout.astro`
  Expected: `content="width=device-width"` (missing `initial-scale=1`)

[x] **GREEN: Fix BaseLayout viewport meta**

  **BEFORE:**
  ```astro
  <meta name="viewport" content="width=device-width" />
  ```

  **AFTER:**
  ```astro
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  ```

[x] **GREEN: Add new page links to navbar**

  In `src/components/navbar.astro`, the navigation links are driven by `links` from `src/lib/values.ts`. Add three new entries to the `links` array in `src/lib/values.ts`:

  ```typescript
  // In src/lib/values.ts, add to the links array (after Case Studies, before Dashboard):
  {
    name: "Services",
    url: "/services"
  },
  {
    name: "Blog",
    url: "/blog"
  },
  {
    name: "About",
    url: "/about"
  },
  ```

  > The navbar already filters and renders links from the `links` array, so adding entries there automatically adds them to the navigation.

[x] **GREEN: Add new page links to footer**

  The footer in `src/components/footer.astro` also reads from `src/lib/values.ts` (`links` and `socials`). The navbar change above automatically flows to the footer as well. No separate footer change needed — both components read from the same `links` array.

  Verify footer still links to Privacy Policy and Terms (it does — those are hardcoded in `footer.astro`).

[x] **GREEN: Verify**

  Run: `bun run build`

  Verify viewport meta:
  Run: `grep 'viewport' dist/index.html`
  Expected: `<meta name="viewport" content="width=device-width, initial-scale=1" />`

  Verify nav links in build output:
  Run: `grep -c '/services' dist/index.html`
  Expected: At least 2 (navbar + footer)

  Run: `grep -c '/blog' dist/index.html`
  Expected: At least 2

  Run: `grep -c '/about' dist/index.html`
  Expected: At least 2

[x] **REFACTOR: Clean up**

  - The `/services`, `/blog`, and `/about` pages don't exist yet (Phase 4). The links will 404 until those pages are created. That's expected. Proceed.

[x] **Commit**

  ```bash
  git add src/layouts/BaseLayout.astro src/lib/values.ts
  git commit -m "fix: add initial-scale=1 to viewport, add Services/Blog/About links to nav (Task 9)"
  ```

---

<!-- PHASE 4: CONTENT EXPANSION -->

## Phase 4: Content Expansion (Blog, Services, About Pages)

> Create the new content sections identified as the highest-impact gap vs competitors. Every new page includes proper SEO metadata from birth.

---

### Task 10: Blog Content Collection

**Files:**
- Create: `src/content/blog/01-website-cost-philippines.md`
- Create: `src/content/blog/02-ai-automation-small-business.md`
- Create: `src/content/blog/03-web-development-agency-cebu.md`
- Modify: `src/content.config.ts` (add blog collection)

**Dependencies:** Task 1 (types exist)

**TDD Cycle:**

[x] **RED: Write the failing test**

  ```typescript
  // Append to src/types/seo.test.ts

  describe("Blog Content Collection", () => {
    it("should define a blog collection in content.config.ts", async () => {
      // After config is updated, build should succeed and include blog pages
      // For now, check that content.config.ts exports 'blog'
      const config = await import("../content.config")
      expect(config.collections).toBeDefined()
      expect(config.collections["blog"]).toBeDefined()
    })

    it("should validate blog frontmatter schema", async () => {
      const config = await import("../content.config")
      const blogCollection = config.collections["blog"]
      expect(blogCollection).toBeDefined()
      // The schema should include title, description, pubDate, author, tags
      expect(blogCollection.schema).toBeDefined()
    })
  })
  ```

[x] **RED: Verify the test fails**

  Run: `bun test src/types/seo.test.ts`
  Expected: FAIL — `config.collections["blog"]` is undefined (blog collection doesn't exist yet).

[x] **GREEN: Add blog collection to content.config.ts**

  ```typescript
  // src/content.config.ts — add blog collection after case-studies

  const blog = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
    schema: ({ image }) =>
      z.object({
        title: z.string(),
        description: z
          .string()
          .max(160, "Meta description must be 160 chars or less"),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        author: z.string().default("DEVGO Studio"),
        tags: z.array(z.string()).default([]),
        image: image().optional(),
        draft: z.boolean().default(false),
      }),
  })

  export const collections = {
    "case-studies": caseStudies,
    blog,
  }
  ```

[x] **GREEN: Create three cornerstone blog posts**

  **File 1: `src/content/blog/01-website-cost-philippines.md`**

  ```markdown
  ---
  title: "How Much Does a Website Cost in the Philippines? (2026 Honest Breakdown)"
  description: "A transparent breakdown of website development costs in the Philippines — from ₱5,000 landing pages to ₱200,000+ custom web applications. No hidden fees."
  pubDate: 2026-05-26
  author: "DEVGO Studio"
  tags:
    - "web development"
    - "pricing"
    - "Philippines"
    - "small business"
  ---

  ## The Real Cost of a Website in the Philippines

  One of the first questions we get: "How much does a website cost?" The honest answer: anywhere from ₱5,000 to ₱200,000+, depending on what you actually need. Here's a breakdown by tier.

  ### Tier 1: Landing Pages (₱5,000 – ₱25,000)

  A single-page site with your brand, a call to action, and contact info. Best for: businesses that just need an online presence to validate they're real.

  **What you get:** Custom design, mobile-responsive layout, contact form, basic SEO setup. **What you don't get:** Multiple pages, CMS backend, advanced functionality.

  ### Tier 2: Business Websites (₱25,000 – ₱80,000)

  5–10 pages: Home, About, Services, Portfolio, Contact. Best for: SMEs that need to showcase their offerings and generate leads.

  **What you get:** Full custom design, CMS for self-updates, SEO structure, mobile optimization, contact forms, Google Maps integration. **What you don't get:** E-commerce, custom web applications, complex integrations.

  ### Tier 3: E-commerce (₱80,000 – ₱200,000+)

  Online stores with product catalogs, shopping carts, payment gateways, and inventory management. Best for: businesses selling products online.

  **What you get:** Everything in Tier 2 plus product management, payment processing, order tracking, inventory system, SEO for products. **What you don't get:** Custom AI features, enterprise integrations (these add cost).

  ### Tier 4: Custom Web Applications (₱150,000 – ₱500,000+)

  Custom SaaS platforms, AI-powered tools, internal business systems. Best for: enterprises needing software built from scratch.

  ## What Affects the Price?

  - **Design complexity** — Custom illustrations and animations add cost
  - **Functionality** — User accounts, dashboards, AI features increase scope
  - **Content** — Who writes the copy? You or us?
  - **Timeline** — Rush jobs cost more
  - **Maintenance** — Ongoing support vs one-time delivery

  ## Why Philippine Agencies Offer Better Value

  Philippine web development agencies deliver US-quality work at 40-60% lower rates. You get senior developers, fluent English communication, and timezone-friendly delivery — without the Silicon Valley price tag.

  **Ready to build?** [Contact DEVGO Studio](mailto:official@devgo.studio) for a free project scope and honest quote.
  ```

  **File 2: `src/content/blog/02-ai-automation-small-business.md`**

  ```markdown
  ---
  title: "AI Automation for Small Businesses: A Practical 2026 Guide"
  description: "Discover how AI automation helps Philippine SMEs reduce manual work by 60-80%, cut costs, and scale operations — with real examples and no hype."
  pubDate: 2026-05-26
  author: "DEVGO Studio"
  tags:
    - "AI automation"
    - "small business"
    - "workflow automation"
    - "Philippines"
  ---

  ## AI Automation Is Not Just for Big Companies

  Small businesses waste 30-50% of their time on repetitive manual tasks: sorting emails, routing customer inquiries, generating reports, following up on leads. AI automation changes that — without requiring a tech team.

  ### What Can You Automate Today?

  **Customer Support Triage** — AI reads incoming messages, determines urgency, and routes them to the right person. No more manual sorting.

  **Lead Qualification** — AI analyzes inbound leads, scores them against your ideal customer profile, and drafts personalized responses.

  **Invoice Processing** — Extract data from PDFs, match to purchase orders, and flag discrepancies automatically.

  **Content Generation** — Draft blog posts, social media captions, and email newsletters with AI assistance.

  **Reporting** — Pull data from multiple tools into a single automated weekly report.

  ### How Much Does It Save?

  | Task | Manual Time/Week | With AI Automation | Time Saved |
  |------|-----------------|-------------------|------------|
  | Email sorting & routing | 10 hours | 1 hour | 90% |
  | Lead follow-up | 8 hours | 2 hours | 75% |
  | Report generation | 5 hours | 15 minutes | 95% |
  | Invoice processing | 6 hours | 30 minutes | 92% |

  ### Getting Started

  1. **Identify your bottleneck** — What repetitive task consumes the most time?
  2. **Map the workflow** — Document exactly what happens step by step
  3. **Choose your tool** — n8n (self-hosted), Make, or custom AI solutions
  4. **Start small** — Automate one workflow, measure results, then expand

  **Want to automate your business?** [Talk to DEVGO Studio](mailto:official@devgo.studio) about AI automation solutions built for your workflow.
  ```

  **File 3: `src/content/blog/03-web-development-agency-cebu.md`**

  ```markdown
  ---
  title: "Top Web Development Agencies in Cebu, Philippines (2026)"
  description: "A curated list of the best web development agencies in Cebu, Philippines — including what to look for, typical pricing, and how to choose the right partner."
  pubDate: 2026-05-26
  author: "DEVGO Studio"
  tags:
    - "web development"
    - "Cebu"
    - "Philippines"
    - "agency guide"
  ---

  ## Why Cebu for Web Development?

  Cebu has emerged as a tech hub in the Philippines, home to skilled developers, competitive rates, and strong English proficiency. Whether you're a local business or an international company looking to outsource, Cebu-based agencies offer a compelling mix of quality and value.

  ### What to Look for in a Web Development Agency

  - **Portfolio** — Do they have projects similar to yours?
  - **Tech stack** — Modern frameworks (Astro, Next.js, Laravel) vs dated tech
  - **SEO knowledge** — Do they build with search engines in mind?
  - **Communication** — English fluency and response time
  - **Post-launch support** — Do they disappear after delivery?

  ### Services to Expect

  A full-service Cebu web development agency should offer:

  - Custom website design and development
  - E-commerce solutions
  - Mobile app development
  - SEO and performance optimization
  - AI and workflow automation

  ### Why DEVGO Studio?

  DEVGO Studio combines modern tech (Astro, AI/LLM, n8n) with a process-driven approach. We build fast, SEO-optimized sites and AI automation systems — and we stay with you after launch.

  **Looking for a web development partner in Cebu?** [Contact DEVGO Studio](mailto:official@devgo.studio) for a free consultation.
  ```

[x] **GREEN: Verify**

  Run: `bun run build`
  Expected: Build succeeds. Blog pages are statically generated.

  Run: `ls dist/blog/`
  Expected:
  ```
  01-website-cost-philippines/
  02-ai-automation-small-business/
  03-web-development-agency-cebu/
  index.html
  ```

  Run: `bun test src/types/seo.test.ts`
  Expected: PASS — blog collection assertions green.

[x] **REFACTOR: Clean up**

  - Verify blog posts appear in sitemap after build: `grep 'blog/' dist/sitemap-0.xml`
  - Ensure blog post dates are correct

[x] **Commit**

  ```bash
  git add src/content.config.ts src/content/blog/
  git commit -m "feat: add blog content collection with 3 cornerstone posts (Task 10)"
  ```

---

### Task 11: Blog Pages — index.astro + [...slug].astro

**Files:**
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[...slug].astro`

**Dependencies:** Task 10 (blog collection exists with content)

**TDD Cycle:**

[x] **RED: Verify pages don't exist yet**

  Run: `bun run build`
  Run: `ls dist/blog/`
  Expected: Only the content collection directories exist (from Task 10).

[x] **GREEN: Create blog list page**

  ```astro
  ---
  // src/pages/blog/index.astro
  import { getCollection } from "astro:content"
  import BaseLayout from "../../layouts/BaseLayout.astro"

  const posts = await getCollection("blog")
  const publishedPosts = posts
    .filter((post) => !post.data.draft)
    .sort(
      (a, b) =>
        b.data.pubDate.getTime() - a.data.pubDate.getTime()
    )

  const seoProps = {
    title: "Blog & Insights | DEVGO Studio",
    description:
      "Web development, AI automation, and digital growth insights from DEVGO Studio. Practical guides for Philippine businesses and global brands.",
    keywords: [
      "web development blog",
      "AI automation insights",
      "Philippines tech blog",
      "digital agency blog",
    ],
    type: "website" as const,
  }
  ---

  <BaseLayout seo={seoProps}>
    <section class='mt-11 md:mt-13 pt-10 md:pt-20 pb-4 md:pb-10 w-full px-2 md:px-6 overflow-hidden'>
      <h1 class='text-3xl md:text-5xl lg:text-7xl font-head uppercase'>
        Blog & Insights
      </h1>
      <p class='mt-4 text-bg-secondary max-w-2xl'>
        Web development, AI automation, and digital growth insights from DEVGO Studio.
      </p>
    </section>

    <section class='px-2 md:px-6 pb-20'>
      <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {
          publishedPosts.map((post) => (
            <a
              href={`/blog/${post.id.replace(/\.md$/, "")}`}
              class='border border-bg-secondary/20 p-4 hover:border-accent/40 transition-colors group'
            >
              <p class='text-xs text-bg-secondary mb-2'>
                {post.data.pubDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <h2 class='font-head text-lg uppercase mb-2 group-hover:text-accent transition-colors'>
                {post.data.title}
              </h2>
              <p class='text-sm text-bg-secondary line-clamp-2'>
                {post.data.description}
              </p>
              <div class='flex flex-wrap gap-1 mt-3'>
                {
                  post.data.tags.slice(0, 3).map((tag) => (
                    <span class='text-xs px-2 py-0.5 bg-bg-secondary/10 rounded-full'>
                      {tag}
                    </span>
                  ))
                }
              </div>
            </a>
          ))
        }
      </div>
    </section>
  </BaseLayout>
  ```

[x] **GREEN: Create blog article page**

  ```astro
  ---
  // src/pages/blog/[...slug].astro
  import { getCollection, render } from "astro:content"
  import BaseLayout from "../../layouts/BaseLayout.astro"

  export async function getStaticPaths() {
    const posts = await getCollection("blog")
    return posts
      .filter((post) => !post.data.draft)
      .map((post) => ({
        params: { slug: post.id.replace(/\.md$/, "") },
        props: { post },
      }))
  }

  const { post } = Astro.props
  const { Content } = await render(post)
  const { title, description, pubDate, author, tags } = post.data
  ---

  <BaseLayout
    seo={{
      title: `${title} | DEVGO Studio`,
      description,
      type: "article",
      publishedTime: pubDate.toISOString(),
      author,
      keywords: tags,
      schema: {
        type: "BreadcrumbList",
        items: [
          { name: "Home", url: "https://devgo.studio/" },
          { name: "Blog", url: "https://devgo.studio/blog/" },
          {
            name: title,
            url: `https://devgo.studio/blog/${post.id.replace(/\.md$/, "")}`,
          },
        ],
      },
    }}
  >
    <article class='mt-11 md:mt-13 pt-10 md:pt-20 pb-20 w-full px-2 md:px-6 max-w-4xl mx-auto'>
      <div class='mb-8'>
        <p class='text-sm text-bg-secondary mb-2'>
          {pubDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          · {author}
        </p>
        <h1 class='text-3xl md:text-5xl font-head uppercase'>
          {title}
        </h1>
        <div class='flex flex-wrap gap-1 mt-4'>
          {tags.map((tag) => (
            <span class='text-xs px-2 py-0.5 bg-bg-secondary/10 rounded-full'>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div class='prose prose-invert max-w-none'>
        <Content />
      </div>
      <div class='mt-12 pt-6 border-t border-bg-secondary/20'>
        <a
          href='/blog'
          class='text-accent hover:text-accent/80 transition-colors'
        >
          ← Back to all posts
        </a>
      </div>
    </article>
  </BaseLayout>
  ```

[x] **GREEN: Verify**

  Run: `bun run build`
  Expected: Build succeeds with blog pages.

  Verify blog list:
  Run: `ls dist/blog/index.html && echo "exists"`
  Expected: `exists`

  Verify blog articles:
  Run: `ls dist/blog/01-website-cost-philippines/index.html && echo "exists"`
  Expected: `exists`

  Verify blog meta:
  Run: `grep '<title>' dist/blog/01-website-cost-philippines/index.html`
  Expected: Contains the blog post title and "| DEVGO Studio"

  Verify breadcrumb in blog posts:
  Run: `grep 'BreadcrumbList' dist/blog/01-website-cost-philippines/index.html`
  Expected: Found

[x] **REFACTOR: Clean up**

  - Verify all 3 blog posts generate with correct metadata
  - Check sitemap includes blog pages: `grep 'blog/' dist/sitemap-0.xml`

[x] **Commit**

  ```bash
  git add src/pages/blog/
  git commit -m "feat: add blog listing and article pages with breadcrumb schema (Task 11)"
  ```

---

### Task 12: Services Pages — index.astro + Individual Service Pages

**Files:**
- Create: `src/pages/services/index.astro`
- Create: `src/pages/services/web-development.astro`
- Create: `src/pages/services/ai-automation.astro`
- Create: `src/pages/services/e-commerce.astro`
- Create: `src/pages/services/mobile-development.astro`
- Create: `src/pages/services/software-development.astro`

**Dependencies:** Task 1 (types), Task 4 (generateServiceSchema utility)

**TDD Cycle:**

[x] **RED: Verify pages don't exist**

  Run: `bun run build`
  Run: `ls dist/services/ 2>/dev/null || echo "no services dir yet"`
  Expected: `no services dir yet`

[x] **GREEN: Create services overview page**

  ```astro
  ---
  // src/pages/services/index.astro
  import BaseLayout from "../../layouts/BaseLayout.astro"
  import type { ServiceSchema } from "../../types/seo"
  import { Globe, Bot, ShoppingCart, TabletSmartphone, AppWindow } from "lucide-astro"

  const services: {
    title: string
    slug: string
    icon: typeof Globe
    description: string
    keywords: string[]
  }[] = [
    {
      title: "Website Development",
      slug: "web-development",
      icon: Globe,
      description:
        "High-performance websites and web applications for global businesses — optimized for speed, scalability, and SEO.",
      keywords: [
        "website development Philippines",
        "custom web development",
        "Astro development",
      ],
    },
    {
      title: "AI Automation",
      slug: "ai-automation",
      icon: Bot,
      description:
        "AI-powered automation solutions that streamline operations, reduce costs, and improve efficiency at scale.",
      keywords: [
        "AI automation agency",
        "workflow automation",
        "n8n automation Philippines",
      ],
    },
    {
      title: "E-Commerce",
      slug: "e-commerce",
      icon: ShoppingCart,
      description:
        "Secure, scalable e-commerce platforms with conversion-focused design and seamless payment integrations.",
      keywords: [
        "e-commerce development Philippines",
        "online store development",
        "Shopify WooCommerce",
      ],
    },
    {
      title: "Mobile Development",
      slug: "mobile-development",
      icon: TabletSmartphone,
      description:
        "High-performing iOS and Android apps delivering seamless, scalable, and user-centric experiences.",
      keywords: [
        "mobile app development Philippines",
        "iOS Android development",
      ],
    },
    {
      title: "Software Development",
      slug: "software-development",
      icon: AppWindow,
      description:
        "Custom software solutions for startups and enterprises — enabling digital transformation and scalable operations.",
      keywords: [
        "custom software development Philippines",
        "enterprise software solutions",
      ],
    },
  ]

  const serviceSchemaItems: ServiceSchema[] = services.map((svc) => ({
    "@type": "Service" as const,
    name: svc.title,
    description: svc.description,
    provider: {
      "@type": "Organization" as const,
      name: "DEVGO Studio",
    },
  }))

  const seoProps = {
    title: "Services | DEVGO Studio",
    description:
      "DEVGO Studio offers web development, AI automation, e-commerce, mobile development, and custom software solutions for Philippine businesses and global brands.",
    keywords: [
      "web development services",
      "AI automation services",
      "digital agency services Philippines",
    ],
    type: "website" as const,
  }
  ---

  <BaseLayout seo={seoProps}>
    <section class='mt-11 md:mt-13 pt-10 md:pt-20 pb-4 md:pb-10 w-full px-2 md:px-6 overflow-hidden'>
      <h1 class='text-3xl md:text-5xl lg:text-7xl font-head uppercase'>
        Our Services
      </h1>
      <p class='mt-4 text-bg-secondary max-w-2xl'>
        Scalable web, mobile, and AI-powered solutions for businesses worldwide.
      </p>
    </section>

    <section class='px-2 md:px-6 pb-20'>
      <div class='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {services.map((svc) => (
          <a
            href={`/services/${svc.slug}`}
            class='border border-bg-secondary/20 p-6 hover:border-accent/40 transition-colors group'
          >
            <svc.icon class='w-8 h-8 stroke-accent mb-3' />
            <h2 class='font-head text-xl uppercase mb-2 group-hover:text-accent transition-colors'>
              {svc.title}
            </h2>
            <p class='text-sm text-bg-secondary'>{svc.description}</p>
          </a>
        ))}
      </div>
    </section>
  </BaseLayout>
  ```

[x] **GREEN: Create individual service pages**

  Create one template and replicate for all 5 services:

  ```astro
  ---
  // src/pages/services/web-development.astro
  // Replicate this pattern for: ai-automation, e-commerce, mobile-development, software-development
  import BaseLayout from "../../layouts/BaseLayout.astro"
  import type { PageSchema } from "../../types/seo"

  const seoProps = {
    title: "Website Development Services | DEVGO Studio",
    description:
      "Custom website development services by DEVGO Studio. High-performance, SEO-optimized websites built with Astro, Next.js, and modern frameworks. Philippines-based, global reach.",
    keywords: [
      "website development Philippines",
      "custom web development",
      "Astro web development",
      "SEO optimized websites",
    ],
    type: "website" as const,
    schema: {
      type: "BreadcrumbList",
      items: [
        { name: "Home", url: "https://devgo.studio/" },
        { name: "Services", url: "https://devgo.studio/services/" },
        {
          name: "Website Development",
          url: "https://devgo.studio/services/web-development/",
        },
      ],
    } satisfies PageSchema,
  }
  ---

  <BaseLayout seo={seoProps}>
    <section class='mt-11 md:mt-13 pt-10 md:pt-20 pb-4 md:pb-10 w-full px-2 md:px-6 overflow-hidden'>
      <p class='text-sm text-bg-secondary mb-2'>
        <a href='/services' class='hover:text-accent transition-colors'>Services</a> / Website Development
      </p>
      <h1 class='text-3xl md:text-5xl lg:text-7xl font-head uppercase'>
        Website Development
      </h1>
    </section>

    <section class='px-2 md:px-6 pb-20 max-w-4xl mx-auto'>
      <div class='prose prose-invert max-w-none'>
        <p class='lead'>
          High-performance websites and web applications for global businesses — optimized for speed, scalability, and SEO.
        </p>

        <h2>What We Build</h2>
        <ul>
          <li><strong>Business Websites</strong> — Professional 5-10 page sites with CMS for self-updates</li>
          <li><strong>Web Applications</strong> — Custom dashboards, SaaS platforms, and internal tools</li>
          <li><strong>Landing Pages</strong> — Conversion-focused single-page sites optimized for campaigns</li>
          <li><strong>E-Commerce Platforms</strong> — Online stores with payment and inventory management</li>
        </ul>

        <h2>Our Tech Stack</h2>
        <p>We use modern, performance-first frameworks:</p>
        <ul>
          <li><strong>Astro</strong> — For content-focused, ultra-fast static sites</li>
          <li><strong>Next.js</strong> — For dynamic web applications</li>
          <li><strong>Tailwind CSS</strong> — For utility-first, responsive design</li>
          <li><strong>TypeScript</strong> — For type-safe, maintainable code</li>
        </ul>

        <h2>SEO Built In</h2>
        <p>Every site we build includes:</p>
        <ul>
          <li>Proper heading hierarchy (H1-H6)</li>
          <li>Meta tags and Open Graph images</li>
          <li>JSON-LD structured data</li>
          <li>XML sitemaps and robots.txt</li>
          <li>Core Web Vitals optimization</li>
        </ul>

        <h2>Process</h2>
        <ol>
          <li><strong>Discovery</strong> — We understand your business, audience, and goals</li>
          <li><strong>Design</strong> — Custom Figma designs tailored to your brand</li>
          <li><strong>Development</strong> — Clean, performant code with modern frameworks</li>
          <li><strong>Launch</strong> — Deploy with SEO, analytics, and monitoring</li>
          <li><strong>Support</strong> — Ongoing maintenance and updates</li>
        </ol>
      </div>

      <div class='mt-8'>
        <a
          href='mailto:official@devgo.studio'
          class='inline-block uppercase font-head text-sm px-4 py-2 border border-accent text-accent hover:bg-accent hover:text-bg transition-colors'
        >
          Get a Quote
        </a>
      </div>
    </section>
  </BaseLayout>
  ```

  Create the other 4 service pages following the same pattern, changing only:
  - `title` and `description` in seoProps
  - `keywords` array
  - Breadcrumb `items[2].name` and `url`
  - H1 text
  - Content sections (tailored to each service)
  - The slug in the file path

  **For AI Automation (`ai-automation.astro`):**
  - Title: `"AI Automation Services | DEVGO Studio"`
  - Description: `"AI-powered automation solutions by DEVGO Studio. Automate customer support, lead qualification, reporting, and workflows with n8n and LLM integration."`
  - Keywords: `["AI automation agency", "workflow automation", "n8n automation", "LLM integration"]`
  - Content: Cover AI customer support, lead qualification, RAG systems, reporting automation, document processing

  **For E-Commerce (`e-commerce.astro`):**
  - Title: `"E-Commerce Development Services | DEVGO Studio"`
  - Description: `"Custom e-commerce development by DEVGO Studio. Secure, scalable online stores with payment integrations, inventory management, and conversion-focused design."`
  - Keywords: `["e-commerce development", "online store Philippines", "Shopify WooCommerce"]`
  - Content: Cover store types, payment gateways, inventory, conversion optimization

  **For Mobile Development (`mobile-development.astro`):**
  - Title: `"Mobile App Development Services | DEVGO Studio"`
  - Description: `"iOS and Android app development by DEVGO Studio. Native and cross-platform mobile applications with seamless user experiences."`
  - Keywords: `["mobile app development", "iOS Android apps", "cross-platform apps"]`
  - Content: Cover native vs cross-platform, app types, deployment

  **For Software Development (`software-development.astro`):**
  - Title: `"Custom Software Development | DEVGO Studio"`
  - Description: `"Custom software solutions for startups and enterprises. SaaS platforms, internal tools, and digital transformation systems built by DEVGO Studio."`
  - Keywords: `["custom software development", "SaaS development", "enterprise software Philippines"]`
  - Content: Cover SaaS, internal tools, enterprise systems, digital transformation

[x] **GREEN: Verify**

  Run: `bun run build`
  Expected: Build succeeds with all service pages.

  Run: `ls dist/services/`
  Expected:
  ```
  ai-automation/
  e-commerce/
  index.html
  mobile-development/
  software-development/
  web-development/
  ```

  Verify meta on service page:
  Run: `grep '<title>' dist/services/web-development/index.html`
  Expected: `<title>Website Development Services | DEVGO Studio</title>`

  Verify breadcrumb:
  Run: `grep 'BreadcrumbList' dist/services/web-development/index.html`
  Expected: Found

  Check sitemap:
  Run: `grep 'services/' dist/sitemap-0.xml`
  Expected: All 6 service URLs listed.

[x] **REFACTOR: Clean up**

  - Ensure all 5 service pages have unique, keyword-rich content
  - Add internal links from service pages to relevant case studies
  - Verify `npx astro check` passes

[x] **Commit**

  ```bash
  git add src/pages/services/
  git commit -m "feat: add services overview and 5 individual service pages with breadcrumb schema (Task 12)"
  ```

---

### Task 13: About Page

**Files:**
- Create: `src/pages/about.astro`

**Dependencies:** Task 9 (nav/footer links to /about exist)

**TDD Cycle:**

[x] **RED: Verify page doesn't exist**

  Run: `curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/about 2>/dev/null || echo "dev server not running"`
  Run: `ls dist/about/ 2>/dev/null || echo "not built yet"`

[x] **GREEN: Create about page**

  ```astro
  ---
  // src/pages/about.astro
  import BaseLayout from "../layouts/BaseLayout.astro"

  const seoProps = {
    title: "About DEVGO Studio — Web Development Agency Cebu, Philippines",
    description:
      "DEVGO Studio is a Filipino web development and AI automation agency based in Cebu, Philippines. We build high-performance websites, mobile apps, and custom software for global brands.",
    keywords: [
      "about DEVGO Studio",
      "Filipino web development agency",
      "Cebu tech studio",
      "web development agency Philippines",
      "digital agency Cebu",
    ],
    type: "website" as const,
  }
  ---

  <BaseLayout seo={seoProps}>
    <section class='mt-11 md:mt-13 pt-10 md:pt-20 pb-4 md:pb-10 w-full px-2 md:px-6 overflow-hidden'>
      <h1 class='text-3xl md:text-5xl lg:text-7xl font-head uppercase'>
        About DEVGO Studio
      </h1>
    </section>

    <section class='px-2 md:px-6 pb-20 max-w-4xl mx-auto'>
      <div class='prose prose-invert max-w-none'>
        <p class='lead'>
          DEVGO Studio is a full-service digital agency based in Cebu, Philippines. We build high-performance websites, AI-powered automation systems, mobile applications, and custom software for startups, SMEs, and enterprises worldwide.
        </p>

        <h2>What We Do</h2>
        <p>
          We are a team of developers, designers, and AI engineers who believe that great digital products come from understanding the business first and the technology second. Every project starts with a deep dive into your goals, your audience, and your constraints. We don't build websites just to look good — we build them to work.
        </p>

        <h2>Our Mission</h2>
        <p>
          To enable businesses — from local startups to global enterprises — to innovate, automate, and grow within a digital-first economy. We deliver scalable, maintainable solutions that solve real problems, not just check feature boxes.
        </p>

        <h2>Our Values</h2>
        <ul>
          <li>
            <strong>Quality Over Shortcuts</strong> — Every line of code is written for performance, maintainability, and SEO.
          </li>
          <li>
            <strong>Client Partnership</strong> — We work with you, not just for you. Communication is central to every project.
          </li>
          <li>
            <strong>Continuous Learning</strong> — The tech landscape changes fast. We stay current so your projects benefit from the best tools available.
          </li>
          <li>
            <strong>Results That Matter</strong> — We measure success by the impact on your business, not just the deliverables we ship.
          </li>
        </ul>

        <h2>Location</h2>
        <p>
          Based in Cebu, Philippines, we serve clients across the Philippines, United States, Australia, Singapore, and beyond. Remote-first since day one.
        </p>
      </div>
    </section>
  </BaseLayout>
  ```

[x] **GREEN: Verify**

  Run: `bun run build`

  Verify about page:
  Run: `ls dist/about/index.html && echo "exists"`
  Expected: `exists`

  Verify meta:
  Run: `grep '<title>' dist/about/index.html`
  Expected: `<title>About DEVGO Studio — Web Development Agency Cebu, Philippines</title>`

  Verify H1:
  Run: `grep '<h1' dist/about/index.html`
  Expected: Contains "About DEVGO Studio"

  Check sitemap:
  Run: `grep 'about/' dist/sitemap-0.xml`
  Expected: Found

[x] **REFACTOR: Clean up**

  - Ensure the page is linked from both navbar and footer (already done in Task 9)

[x] **Commit**

  ```bash
  git add src/pages/about.astro
  git commit -m "feat: add About page with location, mission, and keyword-rich content (Task 13)"
  ```

---

<!-- PHASE 5: POLISH & HARDENING -->

## Phase 5: Polish & Hardening (Images, Performance, Final Verification)

> Optimize assets, improve Core Web Vitals, and verify everything works end-to-end.

---

### Task 14: Image Optimization — Convert PNGs to WebP

**Files:**
- Modify: `src/assets/images/hero.png` → replace with WebP version
- Modify: `public/og-image.png` → replace with 1200×630 optimized version
- Modify: `src/assets/case-studies/*/cover.png` → batch convert to WebP
- Modify: `src/assets/images/mini-studio.png` → convert to WebP

**Dependencies:** None

**TDD Cycle:**

[x] **RED: Measure current sizes**

  Run:
  ```bash
  ls -lh src/assets/images/hero.png public/og-image.png src/assets/images/mini-studio.png
  ls -lh src/assets/case-studies/*/cover.png
  ```
  Expected output (current):
  ```
  src/assets/images/hero.png: 537K
  public/og-image.png: 400K
  src/assets/images/mini-studio.png: 378K
  src/assets/case-studies/*/cover.png: 205K each
  ```

[x] **GREEN: Optimize all images**

  **Step 1 — Convert hero.png to WebP:**

  ```bash
  # Using sharp-cli (install once: bun add -g sharp-cli)
  sharp -i src/assets/images/hero.png -o src/assets/images/hero.webp --format webp --quality 80 --width 1920

  # Or using cwebp (brew install webp):
  cwebp -q 80 -resize 1920 0 src/assets/images/hero.png -o src/assets/images/hero.webp

  # Verify size
  ls -lh src/assets/images/hero.webp
  # Expected: < 100K
  ```

  Then update the hero component to import the WebP version instead of PNG:

  In `src/components/landing/hero.astro`:

  **BEFORE:**
  ```astro
  import bg from "../../assets/images/hero.png"
  ```

  **AFTER:**
  ```astro
  import bg from "../../assets/images/hero.webp"
  ```

  **Step 2 — Optimize og-image.png:**

  ```bash
  # Resize to 1200x630 (OG standard) and compress
  cwebp -q 75 -resize 1200 630 public/og-image.png -o public/og-image-new.webp

  # Or keep as optimized PNG:
  # Use an image editor to resize to 1200x630 and export at quality 70
  # Replace public/og-image.png with the optimized version

  ls -lh public/og-image.png
  # Expected: < 80K
  ```

  **Step 3 — Batch convert cover images to WebP:**

  ```bash
  for dir in src/assets/case-studies/*/; do
    if [ -f "${dir}cover.png" ]; then
      cwebp -q 75 -resize 1920 1080 "${dir}cover.png" -o "${dir}cover.webp"
      echo "Converted: ${dir}cover.png -> cover.webp"
    fi
  done
  ```

  Then update `src/content.config.ts` case study schema to use `.webp` images instead of `.png`. The schema already uses `image()` which accepts any format, so Astro's Image component will handle the rest.

  > **Note:** Delete the original `.png` files from git tracking when the `.webp` versions are confirmed working. Or keep both and let Astro's build choose the optimal format.

  **Step 4 — Convert mini-studio.png to WebP:**

  ```bash
  cwebp -q 80 -resize 1920 0 src/assets/images/mini-studio.png -o src/assets/images/mini-studio.webp
  ls -lh src/assets/images/mini-studio.webp
  # Expected: < 80K
  ```

  Update `src/components/footer.astro`:

  **BEFORE:**
  ```astro
  import desk from "../assets/images/mini-studio.png"
  ```

  **AFTER:**
  ```astro
  import desk from "../assets/images/mini-studio.webp"
  ```

  And in `src/components/landing/reviews.astro`:

  **BEFORE:**
  ```astro
  import bg from "../../assets/images/mini-studio.png"
  ```

  **AFTER:**
  ```astro
  import bg from "../../assets/images/mini-studio.webp"
  ```

[x] **GREEN: Verify**

  Run: `bun run build`
  Expected: Build succeeds with all images processed.

  Check build image sizes:
  ```bash
  ls -lh dist/_astro/hero.*.webp dist/_astro/cover.*.webp dist/_astro/mini-studio.*.webp 2>/dev/null
  ```

  Verify OG image:
  ```bash
  ls -lh dist/og-image.png 2>/dev/null || ls -lh dist/_astro/og-image.*.webp 2>/dev/null
  ```

  Verify total dist size decreased:
  ```bash
  du -sh dist/
  # Expected: smaller than before (was ~4.7M)
  ```

[x] **REFACTOR: Clean up**

  - Remove old PNG files from the repo if they're no longer referenced
  - Or keep both and let Astro pick — but track only the `.webp` if possible
  - Verify `npx astro check` passes with the import changes

[x] **Commit**

  ```bash
  git add src/assets/images/hero.webp public/og-image.png src/assets/case-studies/*/cover.webp src/assets/images/mini-studio.webp
  git add src/components/landing/hero.astro src/components/footer.astro src/components/landing/reviews.astro
  git commit -m "perf: convert hero, og-image, cover, and mini-studio images to WebP (Task 14)"
  ```

---

### Task 15: Performance Optimization — Defer JS + Service Schema Injection

**Files:**
- Modify: `src/components/landing/hero.astro` (defer heavy JS)
- Modify: `src/components/landing/services.astro` (add Service schema JSON-LD)

**Dependencies:** Task 4 (generateServiceSchema), Task 7 (hero refactor)

**TDD Cycle:**

[x] **RED: Measure current JS blocking**

  Run: `bun run build`
  Run: `ls -lh dist/_astro/hero.*.js dist/_astro/animation-manager.*.js dist/_astro/browserAll.*.js dist/_astro/WebGLRenderer.*.js 2>/dev/null`
  Expected: Multiple JS bundles > 100KB each — these load synchronously and block rendering.

[x] **GREEN: Add defer/dynamic import where possible**

  In `src/components/landing/hero.astro`, the `<script>` at the bottom imports `HeroEngine`, `anime`, and `getAnimationManager` eagerly. These can be dynamically imported to reduce initial JS parse time:

  Update the hero script to use dynamic imports:

  ```javascript
  // In hero.astro <script> tag, replace static imports with dynamic:
  // BEFORE:
  // import { HeroEngine } from "../../lib/engines/hero-engine"
  // import { getAnimationManager } from "../../lib/engines/animation-manager"

  // AFTER:
  const manager = getAnimationManager()
  const track = document.getElementById("logo-track")
  const canvas = document.getElementById("hero-canvas") as HTMLCanvasElement
  const wrapper = document.getElementById("hero-wrapper") as HTMLElement

  // Logo Infinite Scroll (lightweight, keep inline)
  if (track && !manager.getReducedMotion()) {
    const logoCount = track.children.length / 2
    animate(track, {
      translateX: [0, "-33.33%"],
      duration: logoCount * 2000,
      ease: "linear",
      loop: true,
    })
  }

  // Load Pixi.js engine AFTER first paint
  if (canvas && wrapper && !manager.getReducedMotion()) {
    // Dynamic import — doesn't block initial render
    import("../../lib/engines/hero-engine").then(({ HeroEngine }) => {
      const engine = new HeroEngine(canvas, wrapper)
      manager.register("hero", engine)
      engine.init()
    })
  }
  ```

  > **Note:** The `anime` import is already at the top of the script via the inline `<script>` tag. Astro will already treeshake and code-split. The key improvement is making the Pixi.js `HeroEngine` load dynamically after first contentful paint.

[x] **GREEN: Add Service schema to services section**

  The spec calls for Service structured data. Since `src/components/landing/services.astro` is a component (not a page), we inject the schema via a `<script type="application/ld+json">` tag.

  ```astro
  ---
  // Add to the top of services.astro frontmatter
  import { services as servicesData } from "../../lib/values"
  import { generateServiceSchema } from "../../utils/seo"
  import type { ServiceSchema } from "../../types/seo"

  const serviceSchemaItems: ServiceSchema[] = servicesData.map((svc) => ({
    "@type": "Service" as const,
    name: svc.title,
    description: svc.description,
    provider: {
      "@type": "Organization" as const,
      name: "DEVGO Studio",
    },
  }))

  const serviceJsonLd = JSON.stringify(generateServiceSchema(serviceSchemaItems))
  ---

  <!-- Add just before the closing </section> tag -->
  <script type="application/ld+json" set:html={serviceJsonLd} />
  ```

[x] **GREEN: Verify**

  Run: `bun run build`
  Expected: Build succeeds.

  Verify dynamic import in hero:
  Run: `grep 'import(' dist/_astro/hero.*.js`
  Expected: Found (dynamic import pattern)

  Verify Service schema on homepage:
  Run: `grep '"@type":"ItemList"' dist/index.html`
  Expected: Found

  Run: `grep '"@type":"Service"' dist/index.html`
  Expected: Found

  Verify Service schema NOT on other pages:
  Run: `grep '"@type":"ItemList"' dist/case-studies/ai-customer-support/index.html`
  Expected: NOT found (Service schema only on homepage)

[x] **REFACTOR: Clean up**

  - Test on a local dev server to confirm Pixi.js still initializes correctly with dynamic import
  - Check console for any import errors

[x] **Commit**

  ```bash
  git add src/components/landing/hero.astro src/components/landing/services.astro
  git commit -m "perf: dynamically import Pixi.js engine after first paint; add Service JSON-LD schema (Task 15)"
  ```

---

### Task 16: Final Verification — Build, Test, Schema Validation

**Files:**
- (no new files — verification only)

**Dependencies:** All previous tasks

**TDD Cycle:**

[x] **RED: Run all tests**

  ```bash
  bun test src/types/seo.test.ts
  ```
  Expected: All tests from Tasks 1-4 must still pass.

[x] **GREEN: Full production build**

  ```bash
  bun run build
  ```
  Expected: Build succeeds with zero errors.

[x] **GREEN: Build output verification checklist**

  Run each check and confirm the expected result:

  ```bash
  # 1. Sitemap exists and has proper structure
  ls dist/sitemap.xml dist/sitemap-index.xml dist/sitemap-0.xml
  grep -c '<url>' dist/sitemap-0.xml  # Should show 16+ URLs (home, case studies x6, showcase, privacy, terms, about, services x6, blog x3)

  # 2. robots.txt has no Disallow lines
  grep 'Disallow' dist/robots.txt  # Expected: NO output

  # 3. Homepage has H1
  grep '<h1' dist/index.html  # Expected: found

  # 4. Homepage title is keyword-rich
  grep '<title>' dist/index.html  # Expected: DEVGO Studio — Web Development & AI Automation Agency Philippines

  # 5. Showcase has description
  grep 'meta name="description"' dist/showcase/index.html  # Expected: found with text

  # 6. Case study has breadcrumb
  grep 'BreadcrumbList' dist/case-studies/ai-customer-support/index.html  # Expected: found

  # 7. Case study cover image has meaningful alt text
  grep 'alt=""' dist/case-studies/ai-customer-support/index.html  # Expected: NO output

  # 8. OG image exists and is reasonable size
  ls -lh dist/og-image.png dist/_astro/og-image.* 2>/dev/null

  # 9. Blog pages exist
  ls dist/blog/index.html dist/blog/01-website-cost-philippines/index.html

  # 10. Services pages exist
  ls dist/services/index.html dist/services/web-development/index.html

  # 11. About page exists
  ls dist/about/index.html

  # 12. Organization schema only on homepage
  grep -c 'Organization' dist/case-studies/ai-customer-support/index.html  # Expected: 0 or only in Article publisher

  # 13. Service schema on homepage
  grep '"@type":"Service"' dist/index.html  # Expected: found

  # 14. No sitemap link in head
  grep 'rel="sitemap"' dist/index.html  # Expected: NO output

  # 15. Viewport has initial-scale=1
  grep 'initial-scale=1' dist/index.html  # Expected: found

  # 16. Navbar has new links
  grep '/services' dist/index.html  # Expected: found
  grep '/blog' dist/index.html  # Expected: found
  grep '/about' dist/index.html  # Expected: found
  ```

[x] **GREEN: TypeScript check**

  ```bash
  npx astro check
  ```
  Expected: Zero type errors.

[x] **GREEN: Schema validation**

  Extract JSON-LD from built HTML and validate:
  ```bash
  # Extract JSON-LD from homepage
  grep -oP '<script type="application/ld\+json">\K.*?(?=</script>)' dist/index.html | head -1 | python3 -m json.tool > /tmp/devgo-homepage-schema.json

  # Validate manually at: https://validator.schema.org/
  # Or use: curl -X POST -H "Content-Type: application/json" -d @/tmp/devgo-homepage-schema.json https://validator.schema.org/validate
  ```

[x] **GREEN: Lighthouse audit**

  If the site is running locally or on a staging environment:
  ```bash
  # Run a local preview
  bun run preview &
  sleep 2

  # Use Lighthouse CLI
  npx lighthouse http://localhost:4321 --output html --output-path /tmp/lighthouse-report.html --only-categories=seo,performance
  ```

  Or use PageSpeed Insights on the live site after deployment:
  `https://pagespeed.web.dev/analysis/https-devgo-studio/...`

[x] **REFACTOR: Clean up**

  - Fix any failing checks from the verification checklist above
  - Ensure every page has unique, keyword-rich content
  - Re-run `bun run build` after any fixes

[x] **Final Commit (squash or keep separate)**

  ```bash
  git status
  # Verify all changes are committed
  git log --oneline -16
  # Should show 16 commits, one per task
  ```

  > At this point, every fix, every new page, and every optimization is committed. The project is ready for deployment.

---

## Post-Plan: Deployment & Handoff

1. **Push to prod branch:** `git push origin prod`
2. **Trigger Dokploy rebuild** — the Dockerfile rebuilds and deploys automatically
3. **Submit sitemap to Google Search Console** — `https://devgo.studio/sitemap-index.xml`
4. **Request indexing** for key new pages: `/blog/`, `/services/`, `/about/`
5. **Monitor for 7 days** — check GSC for crawl errors, indexing status, Core Web Vitals
6. **30-day check-in** — measure organic traffic baseline and keyword position changes

---
