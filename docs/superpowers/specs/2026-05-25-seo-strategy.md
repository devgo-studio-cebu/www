# SEO Improvement Strategy: DEVGO Studio

## 1. Executive Summary

DEVGO Studio is a Philippine-based creative digital agency running a visually stunning, custom-built Astro 6 SSG website deployed at `devgo.studio`. The site has solid SEO foundations — clean URLs, proper OG/Twitter cards, functional sitemap, custom 404 page, WebP-optimized images (for works), and privacy-friendly self-hosted analytics. However, several critical issues actively hurt search visibility: the homepage has no H1 tag, case study pages redirect through an insecure HTTP hop, the robots.txt blocks Google from the `/_astro/` assets directory, hero and cover images remain unoptimized 205-537KB PNGs, and the Pixi.js + animejs bundle totals ~435KB of render-blocking JavaScript. On the content side, there is no blog or news section (a major gap versus competitors like Web Atelier who publish regular SEO content), the Showcase page is missing a meta description entirely, the Organization schema is duplicated across every page, and no BreadcrumbList, Service, or FAQ structured data exists. This strategy addresses these issues in order of highest SEO impact.

### Top 3 Highest-Impact Improvements

1. **Fix homepage H1 & meta strategy** — The homepage is the most important page and lacks an H1 tag, has a 7-character title ("DEVGO Studio"), and doesn't target any specific keyword. Fixing this alone could meaningfully improve rankings for "web development agency Philippines" and related terms.
2. **Fix redirect chain & robots.txt assets block** — `/case-studies` → HTTP redirect creates an extra hop, and the `/_astro/` blocking in robots.txt prevents Google from discovering optimized image assets. Both are quick fixes with outsized impact.
3. **Launch a blog/content section** — Every top competitor publishes regular content. DEVGO has zero dynamic content outside of case studies. A blog targeting service keywords ("AI automation Philippines", "website development cost") is the highest-leverage growth channel.

### Estimated Effort

**Medium** — Most fixes are config/code changes in an Astro SSG project. The blog addition is the highest-effort item but also the highest-impact.

---

## 2. Technical SEO Fixes (Prioritized)

### Critical (Implement First)

- [ ] **Fix 1: Add H1 tag to homepage** — The landing page has `<h2>` and `<h3>` tags but no `<h1>`. Change the hero subtitle from `<h2>` to `<h1>` and make it keyword-rich (e.g., "Web Development & AI Automation Agency Philippines").
  - **Impact:** High — H1 is a primary ranking signal; missing it is a significant deficiency
  - **Effort:** Low — single line change in `hero.astro`
  - **Files:** `src/components/landing/hero.astro`

- [ ] **Fix 2: Fix robots.txt `/_astro/` disallow** — The `User-agent: * Disallow: /_astro/` rule blocks Googlebot from crawling the optimized asset directory. This prevents Google Image Search from indexing WebP images and may limit page rendering signals. Remove this rule.
  - **Impact:** High — directly affects image search discovery and page rendering
  - **Effort:** Low — remove 1 line from `src/pages/robots.txt.ts`
  - **Files:** `src/pages/robots.txt.ts`

- [ ] **Fix 3: Fix trailing slash redirect to HTTPS** — `/case-studies` redirects to `http://devgo.studio/case-studies/` (HTTP, not HTTPS). Fix the nginx config to redirect to HTTPS with trailing slash, or implement a canonical/301 strategy.
  - **Impact:** High — redirect chain wastes crawl budget; HTTP redirect is a security flag
  - **Effort:** Medium — requires nginx config change and/or Astro route config update
  - **Files:** `nginx.conf`, `astro.config.mjs`

- [ ] **Fix 4: Create `/sitemap.xml` as the standard sitemap endpoint** — The site has `sitemap-index.xml` + `sitemap-0.xml` (Astro's default output), but the standard `/sitemap.xml` returns **404**. Most SEO tools, crawlers, and Search Console submissions expect `/sitemap.xml` by default. Fix by either: (a) configuring Astro's sitemap integration to output `sitemap.xml` as the index, (b) adding an nginx rewrite rule from `/sitemap.xml` → `/sitemap-index.xml`, or (c) creating a static redirect `sitemap.xml` in `public/`. Additionally, configure `@astrojs/sitemap` to include `<lastmod>` timestamps to help Google prioritize re-crawling.
  - **Impact:** High — missing standard sitemap endpoint means crawlers may not discover all pages efficiently
  - **Effort:** Low — single config change or nginx rule
  - **Files:** `astro.config.mjs`, `nginx.conf` (or `public/sitemap.xml` with redirect)

- [ ] **Fix 5: Add meta description to Showcase page** — The Showcase page seoProps has no `description` field. Add a compelling 150-160 char description.
  - **Impact:** Medium — lacking description means Google may auto-generate a poor snippet
  - **Effort:** Low — add one line to `showcase.astro`
  - **Files:** `src/pages/showcase.astro`

- [ ] **Fix 6: Optimize hero image (537KB PNG → ~100KB WebP)** — The hero background image `hero.png` is 537KB and stays as PNG in the build output (unlike works images which get WebP-converted). Convert to WebP or configure Astro Image optimization for it.
  - **Impact:** Medium — LCP improvement, bundle size reduction
  - **Effort:** Low — convert source image or configure Astro image service
  - **Files:** `src/assets/images/hero.png`

### Important (Implement Second)

- [ ] **Fix 7: Optimize OG image (409KB PNG → <100KB)** — `og-image.png` is 409KB and served as-is from `/public/` (no Astro processing). Resize and compress.
  - **Impact:** Medium — page weight reduction, faster social share rendering
  - **Effort:** Low — replace file with optimized version
  - **Files:** `public/og-image.png`

- [ ] **Fix 8: Optimize case study cover images (205KB each → ~60KB WebP)** — Cover images in `src/assets/case-studies/` are 205KB PNGs. Convert to WebP with proper compression.
  - **Impact:** Medium — reduces page weight across 5 case study pages
  - **Effort:** Low — batch convert images
  - **Files:** `src/assets/case-studies/*/cover.png`

- [ ] **Fix 9: Scope Organization schema to homepage only** — The `seo.astro` component injects Organization + WebSite schema on *every* page. Move to homepage-only injection to avoid schema bloat.
  - **Impact:** Low-Medium — Google is tolerant, but best practice is per-page specificity
  - **Effort:** Low — add conditional logic
  - **Files:** `src/components/seo.astro`

- [ ] **Fix 10: Add BreadcrumbList schema to case study pages** — Case study detail pages have no breadcrumb schema. This is a rich result opportunity.
  - **Impact:** Medium — breadcrumb rich snippets improve SERP visibility
  - **Effort:** Low — add JSON-LD generation
  - **Files:** `src/pages/case-studies/[slug].astro`, `src/utils/seo.ts`

- [ ] **Fix 11: Add Service schema to services section** — The services section has no structured data. Service schema helps Google understand what the agency offers.
  - **Impact:** Medium — enables potential service rich results
  - **Effort:** Low — add JSON-LD to services component
  - **Files:** `src/components/landing/services.astro`, `src/utils/seo.ts`

- [ ] **Fix 12: Improve homepage title tag** — Currently "DEVGO Studio" (7 chars) — far too short. Add descriptive keywords: "DEVGO Studio — Web Development & AI Automation Agency Philippines" (~60 chars).
  - **Impact:** Medium — primary ranking signal, CTR influencer
  - **Effort:** Low — edit string in `index.astro`
  - **Files:** `src/pages/index.astro`

### Nice-to-Have

- [ ] **Fix 13: Add `initial-scale=1` to viewport meta tag** — Currently `width=device-width` without `initial-scale=1`. Minor but recommended for mobile.
  - **Effort:** Low
  - **Files:** `src/layouts/BaseLayout.astro`

- [ ] **Fix 14: Add security headers (X-Frame-Options, CSP, Referrer-Policy)** — Missing from nginx config. Helps with security scoring.
  - **Effort:** Low
  - **Files:** `nginx.conf`

- [ ] **Fix 15: Remove sitemap link from seo.astro `<head>`** — The `seo.astro` component includes `<link rel='sitemap' href='/sitemap-index.xml' />` which is non-standard and unnecessary. Sitemaps are discovered via robots.txt or Search Console submission, not HTML `<link>` tags.
  - **Effort:** Low
  - **Files:** `src/components/seo.astro`

- [ ] **Fix 16: Add alt text to case study cover images** — The case study detail page passes `alt=''` (empty alt) for the cover image. Use the title as alt text.
  - **Effort:** Low
  - **Files:** `src/pages/case-studies/[slug].astro`

---

## 3. On-Page & Content Improvements

### Title/Meta Optimization Per Template

| Page Template | Current Title | Current Description | Recommended Title | Recommended Description |
|---|---|---|---|---|
| Homepage | "DEVGO Studio" (7 chars) | Good (160 chars) | "DEVGO Studio — Web Development & AI Automation Agency Philippines" (60 chars) | Keep current — it's strong. Add "Cebu-based" or "Philippines" if relevant. |
| Case Studies | "Case Studies \| DEVGO Studio" (30 chars) | Good (121 chars) | Keep — well-optimized | Keep |
| Case Study Detail | `{title} \| DEVGO Studio` | Uses subtitle from frontmatter | Add keyword-rich H2 subheadings that target service-specific terms | Ensure each case study subtitle contains a relevant keyword |
| Showcase | "Showcase \| DEVGO Studio" (23 chars) | **MISSING** | "Portfolio & Showcase \| DEVGO Studio" | "Browse our portfolio of web development, AI automation, and mobile app projects. See how DEVGO Studio delivers digital results for global brands." |
| Privacy Policy | "Privacy Policy \| DEVGO Studio" | OK | Keep | Keep |
| Terms of Service | "Terms of Service \| DEVGO Studio" | OK | Keep | Keep |
| 404 | "404 — Page Not Found \| DEVGO Studio" | OK | Keep | Keep |

### Content Gap Analysis

**Pages to Create:**

1. **📝 Blog / Insights section** — Highest priority content addition. Target:
   - "How Much Does a Website Cost in the Philippines?" (high search volume, low competition)
   - "AI Automation for Small Businesses: A 2026 Guide"
   - "Web Development vs No-Code: Which Is Right for Your Business?"
   - "Case Study: How We Reduced Support Response Time by 80% with AI"
   - "Top Web Development Agencies in Cebu, Philippines" (local SEO)
   - Each weekly post creates indexable, fresh content that signals site vitality

2. **📄 Services page** — Currently services are listed only on the homepage hero section. Create a dedicated `/services` page with:
   - Detailed service descriptions
   - Process overview
   - Pricing tiers or ranges (like Web Atelier's `from ₱25,000`)
   - FAQ schema per service
   - This can target long-tail service keywords

3. **📄 About page** — Currently no `/about` page. Create one with:
   - Team introduction
   - Studio location (Cebu, Philippines)
   - Mission, values, and process
   - Can target "web development agency Cebu" and "Filipino web developers"

4. **🏗️ Dedicated `/services/[service]` pages** — Individual pages for Website Development, AI Automation, E-Commerce, Mobile Development, Software Development. Each targets specific keyword clusters.

**Pages to Improve:**

1. **Homepage** — Add more keyword-rich body text below the services section. Currently the page has very little readable text for crawlers.
2. **Showcase** — Add project descriptions (not just titles). Currently each project link shows only the title.

### Internal Linking Strategy

| From | To | Anchor Text | Priority |
|---|---|---|---|
| Homepage (services) | `/services` (to be created) | "See our development process" | High |
| Homepage (featured) | `/case-studies/{slug}` | "Read the case study" | High |
| Case study detail | `/case-studies` | "Back to all case studies" | Already exists |
| Case study detail | `/services/ai-automation` | "Explore our AI automation services" | Medium |
| Blog posts | Case studies | "See how we helped [client] with this" | High |
| Blog posts | Service pages | Contextual links within content | High |
| Footer | All main pages | Already decent | — |
| Navbar | All main pages | Already decent | — |

Add internal links from case studies to related services and vice versa. Each case study should link to at least 2 other pages.

---

## 4. Structured Data Implementation

### Schema Types Needed

| Schema Type | Pages | Priority | Current Status |
|---|---|---|---|
| Organization | Homepage only | High | ✅ Present but on ALL pages — scope to homepage |
| WebSite | Homepage only | Medium | ✅ Same — scope to homepage |
| Article | Case study detail | High | ✅ Present with publishedTime |
| BreadcrumbList | Case study detail, Case studies list | High | ❌ Missing |
| Service | Case study detail, Services page | Medium | ❌ Missing |
| FAQPage | Blog posts, Services page | Medium | ❌ Missing |
| Review | Homepage (reviews section) | Low | ❌ Missing — could use AggregateRating |
| LocalBusiness | About page | Low | ❌ Missing — worth adding for local SEO |

### Implementation Approach

The project already has a solid SEO utility layer in `src/utils/seo.ts` with:
- `generateBreadcrumbSchema()` — exists but unused
- `generateArticleSchema()` — exists but overridden by inline Article schema in seo.astro
- `generatePersonSchema()` — exists
- `validateSeoProps()` — exists but unused

**Recommendation:** Use the existing utilities and add:
1. `generateServiceSchema()` — for services
2. `generateReviewSchema()` — for testimonials/reviews
3. Extend `generateBreadcrumbSchema()` usage to case study pages

### JSON-LD Location

All schema should be injected via the existing `seo.astro` component (which already generates JSON-LD with `set:html`). Add conditional schema injection based on page type.

---

## 5. Keyword Targeting Map

| Page/URL | Primary Keyword | Secondary Keywords | Search Intent |
|---|---|---|---|
| `/` | web development agency Philippines | AI automation Philippines, digital agency Cebu | Commercial investigation |
| `/services` (new) | web development services Philippines | custom website development, AI integration services | Commercial |
| `/services/web-development` (new) | website development company Philippines | responsive web design, Astro development | Transactional |
| `/services/ai-automation` (new) | AI automation agency | workflow automation, AI business solutions | Commercial |
| `/services/e-commerce` (new) | e-commerce development Philippines | Shopify development, WooCommerce | Transactional |
| `/services/mobile-development` (new) | mobile app development Philippines | iOS Android development Philippines | Transactional |
| `/services/software-development` (new) | custom software development Philippines | enterprise software solutions | Commercial |
| `/case-studies/` | web development case studies | AI automation case studies, portfolio | Commercial investigation |
| `/case-studies/ai-customer-support` | AI customer support automation | ticket routing system, n8n automation | Informational/Commercial |
| `/case-studies/ai-lead-qualification` | AI lead qualification system | automated lead routing, AI sales | Informational/Commercial |
| `/case-studies/hopethreads-website` | e-commerce website redesign | charity e-commerce optimization | Informational/Commercial |
| `/case-studies/rag-internal-knowledge` | internal knowledge AI assistant | RAG system implementation | Informational/Commercial |
| `/case-studies/rag-product-service` | AI product knowledge assistant | RAG customer support | Informational/Commercial |
| `/showcase` | web development portfolio Philippines | agency portfolio, past projects | Commercial investigation |
| `/blog/website-cost-philippines` (new) | how much does a website cost Philippines | website pricing 2026, affordable web development | Informational |
| `/blog/ai-automation-small-business` (new) | AI automation for small business | business process automation | Informational |
| `/blog/web-development-agency-cebu` (new) | web development agency Cebu | Cebu digital agency, Cebu web developers | Local commercial |
| `/about` (new) | about DEVGO Studio | Filipino web development agency, Cebu tech studio | Informational |

---

## 6. Performance Optimization

### Image Optimization Strategy

| Asset | Current Size | Target Size | Method |
|---|---|---|---|
| `hero.png` | 537KB | <100KB | Resize to max 1920px wide, convert to WebP |
| `og-image.png` | 409KB | <80KB | Resize to 1200x630px (OG standard), high compression WebP/JPEG |
| Cover images (×6) | 205KB each | <60KB each | Convert source PNGs to WebP |
| `mini-studio.png` | 378KB | <80KB | Convert to WebP, resize |
| `serialkitten.png` | 1.8MB (large variant) | Already has WebP build output (81KB) | Ensure WebP is served, not PNG |

**Note:** The works images (hopethreads, palms, serialkitten at 4.7MB, 6.9MB, 1.8MB) are already being WebP-optimized by Astro's build system to 26-132KB. The issue is that the source files in git remain massive, bloating the repo. Add `.gitignore` rules or pre-commit hooks for source images.

### Core Web Vitals Targets

| Metric | Target | Current Assessment |
|---|---|---|
| LCP | < 2.5s | **At risk** — 537KB hero PNG + ~435KB JS bundle (Pixi.js) loading on first viewport |
| FID | < 100ms | **Likely passing** — SSG with minimal first-contentful-paint JS |
| CLS | < 0.1 | **Likely passing** — SSG with no dynamic layout shifts observed |

**Key actions:**
1. Load Pixi.js engine scripts with `fetchpriority="low"` or dynamic import after LCP
2. Preload hero image in WebP format
3. Defer non-critical JS bundles (animation-heavy scripts)

### Caching & CDN

The site already has strong Nginx caching (`expires 1y`) for static assets and sits behind Cloudflare. Ensure:
- `Cache-Control: public, immutable` for hashed assets (already configured)
- HTML pages use `no-cache` or short TTL to propagate updates
- Cloudflare page rules for static asset optimization (Auto Minify, Polish for image compression)

---

## 7. Measurement & Tracking

### Key SEO Metrics

| Metric | Baseline | Tool | Checkpoint |
|---|---|---|---|
| Organic traffic (monthly) | TBD | Google Search Console | 30/60/90 days |
| Average keyword position | TBD | GSC / Rank tracker | Monthly |
| Keyword ranking count | TBD | GSC | Monthly |
| Core Web Vitals (LCP, FID, CLS) | TBD | GSC Core Web Vitals report | After technical fixes |
| Indexed pages | 10 (from sitemap) | GSC | Weekly initial, then monthly |
| Crawl errors | TBD | GSC | Weekly |
| Backlink count | TBD | Ahrefs / GSC | Monthly |
| CTR from organic search | TBD | GSC | Monthly |
| Bounce rate (organic) | TBD | Analytics | Monthly |

### Recommended Tools

1. **Google Search Console** — Free, essential. Monitor impressions, clicks, indexing, Core Web Vitals.
2. **Google Analytics 4** — Self-hosted analytics exists but consider GA4 for richer SEO data.
3. **Ahrefs / SEMrush** — Paid rank tracker, backlink analysis, keyword research, competitor gap analysis.
4. **PageSpeed Insights** — Free, for Core Web Vitals measurement and optimization suggestions.
5. **Schema.org Validator** — Validate structured data before deployment.

### Checkpoint Schedule

| Checkpoint | Timeline | Focus |
|---|---|---|
| Week 1 | Immediate | Fix critical technical issues (H1, robots.txt, redirects, missing descriptions) |
| Week 2 | After critical fixes | Deploy image optimization, schema improvements |
| Week 3 | Content launch | Launch blog section, write 3-5 cornerstone posts |
| Day 30 | First review | Measure organic traffic baseline, keyword rankings, indexed pages |
| Day 60 | Second review | Content performance, adjust keyword targeting, add more blog posts |
| Day 90 | Third review | Full SEO performance assessment, adjust strategy based on data |

---

## 8. Stack-Specific Implementation Notes

### Astro 6 Gotchas

1. **Image optimization**: `@astrojs/image` is built into Astro 6 as `astro:assets`. The `Image` component is used extensively. Ensure all images imported from `src/assets/` go through `Image` for automatic WebP/AVIF conversion. The `public/` directory bypasses processing — move `og-image.png` to `src/assets/` for optimization.
2. **Sitemap customization**: `@astrojs/sitemap` (`3.7.2`) generates `sitemap-index.xml` + `sitemap-0.xml` by default. To create a `/sitemap.xml` endpoint, either: (a) configure via `sitemap()` integration options if Astro 6 supports output path customization — check docs for `filter` or custom output; (b) add an nginx rewrite rule: `rewrite ^/sitemap\.xml$ /sitemap-index.xml permanent;`; or (c) place a static `public/sitemap.xml` file that performs a client-side redirect or mirrors the index. Additionally configure `lastmod` output by passing `lastmod: new Date()` in sitemap entries.
3. **`astro:content`**: Already used for case studies. Blog posts should follow the same content collection pattern with a new `blog` collection in `src/content.config.ts`.
4. **SSG vs SSR**: Currently full SSG. Adding a blog doesn't require SSR — SSG with `getStaticPaths` works perfectly.
5. **Robots.txt**: Currently an API route (`APIRoute`). This is fine but can be simplified to a static file in `public/robots.txt` since it doesn't change dynamically.

### Files to Touch

```
src/
├── components/
│   ├── landing/
│   │   └── hero.astro              # Fix H1 tag
│   ├── seo.astro                    # Scope Organization schema, add conditional schema
│   └── landing/
│       └── services.astro           # Add Service schema
├── layouts/
│   └── BaseLayout.astro             # Fix viewport meta, minor adjustments
├── pages/
│   ├── index.astro                  # Better title, richer body content
│   ├── showcase.astro               # Add meta description
│   ├── case-studies/
│   │   └── [slug].astro             # Add breadcrumb schema, fix alt text
│   ├── robots.txt.ts                # Remove /_astro/ disallow
│   ├── blog/                        # NEW — blog section
│   │   ├── index.astro
│   │   └── [...slug].astro
│   └── services/                   # NEW — dedicated service pages
│       ├── index.astro
│       ├── web-development.astro
│       ├── ai-automation.astro
│       ├── e-commerce.astro
│       └── mobile-development.astro
├── content/
│   └── config.ts                    # Add blog collection
├── types/
│   └── seo.ts                       # Add ServiceSchema, BreadcrumbSchema types
├── utils/
│   └── seo.ts                       # Use existing generateBreadcrumbSchema, add generateServiceSchema
nginx.conf                            # Fix redirect chain, add security headers, add sitemap.xml rewrite
public/
│   └── og-image.png                 # Replace with optimized version
│   └── sitemap.xml                  # OPTIONAL — static redirect if nginx route not used
src/assets/
│   ├── images/
│   │   └── hero.png                 # Replace with WebP
│   └── case-studies/
│       └── */cover.png             # Replace with WebP
astro.config.mjs                     # Add blog collections, sitemap customization
```

### Key Dependencies

| Package | Version | Purpose | SEO Relevance |
|---|---|---|---|
| `@astrojs/sitemap` | 3.7.2 | Sitemap generation | High |
| `@astrojs/mdx` | 5.0.3 | Content authoring (case studies, blog) | High |
| `astro` | 6.1.4 | Framework | Core |
| `tailwindcss` | 4.2.2 | Styling | Low |
| `animejs` | 4.3.6 | Animation | Negative (adds JS weight) |
| `pixi.js` | 8.17.1 | Particle effects | Negative (adds ~435KB JS) |
| `@fontsource-variable/montserrat` | 5.2.8 | Font loading | Neutral (good self-hosting) |

### No Additional Plugins Needed

The project has a custom SEO component that's already well-structured. Rather than adding an external SEO plugin, extend the existing `seo.astro` and `utils/seo.ts` to handle the additional schema types and conditional injection. This keeps the bundle lean and avoids duplication.
