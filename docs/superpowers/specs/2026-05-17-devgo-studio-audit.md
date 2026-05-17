# DEVGO Studio — Architectural Audit & Improvement Spec

**Date:** 2026-05-17
**Scope:** Full-site audit of https://devgo.studio
**Stack:** Astro 6.1.4, TailwindCSS 4, PIXI.js 8, anime.js 4, nginx:alpine
**Status:** Source of Truth — Architectural Boundaries & Constraints

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Critical Issues (P0)](#critical-issues-p0)
3. [High-Priority Improvements (P1)](#high-priority-improvements-p1)
4. [Medium-Priority Improvements (P2)](#medium-priority-improvements-p2)
5. [Low-Priority / Nice-to-Have (P3)](#low-priority-nice-to-have-p3)
6. [Architectural Boundaries & Constraints](#architectural-boundaries--constraints)
7. [Security Requirements](#security-requirements)
8. [Data Flow & Logic Architecture](#data-flow--logic-architecture)
9. [System Mapping](#system-mapping)

---

## Executive Summary

DEVGO Studio is a digital creative agency portfolio site built with Astro, featuring PIXI.js-powered particle backgrounds, anime.js scroll animations, and a content-driven case studies section. The visual design is strong and the site conveys professionalism. However, the codebase exhibits significant architectural debt: massive duplication of rendering engines across pages, incomplete routing and navigation patterns, placeholder-quality review data, and a fragmented PIXI.js lifecycle that runs multiple WebGL contexts simultaneously without cleanup. These issues impact maintainability, performance, SEO, and user experience.

---

## Critical Issues (P0)

### P0-1: Analytics Script Integrity

**Observation:** The analytics script at `https://analytics.devgo.studio/api/script.js` is loaded via an `is:inline` `<script>` tag in `seo.astro` without integrity verification.

**Impact:**
- If the analytics server is compromised, arbitrary JavaScript could be injected into every page
- No SRI hash or CORS policy to ensure script integrity

**Constraint:** Add `integrity="sha384-..."` and `crossorigin="anonymous"` to the analytics script tag. Alternatively, self-host the script for full control. Do NOT remove `is:inline` as the script must execute synchronously.

---

### P0-2: Massive PIXI.js Engine Duplication

**Observation:** The `WaveParticleBg` class (~150 lines) is copy-pasted verbatim into both `showcase.astro` and `case-studies.astro`. The `FlowFieldBg` class in `[slug].astro` contains a full Perlin noise implementation (~80 lines) that could be shared. The `HeroEngine` in `hero.astro`, the `ParticleLogoEngine` in `services.astro`, and the flow field engine in `[slug].astro` all initialize independent PIXI.Application instances and run separate `requestAnimationFrame` / `ticker` loops.

**Impact:**
- ~500+ lines of duplicated, non-trivial rendering logic across 5 components
- Any bug fix or performance improvement requires editing 5 files
- On the homepage alone, up to 3 PIXI.Applications may run simultaneously (hero + services + potential future additions)
- Each PIXI.Application allocates its own WebGL context — mobile devices may crash or experience severe frame drops

**Constraint:** All PIXI.js rendering engines MUST be extracted into shared, reusable modules under `src/lib/engines/`. Each engine must:
- Accept a canvas element and config, not hardcode references to DOM IDs
- Expose `init()` and `destroy()` lifecycle methods
- Be importable by any page without duplication
- Use a singleton or resource-sharing pattern where multiple engines coexist on the same page

**Boundary:** No inline PIXI class definitions in `.astro` files. Any PIXI engine >30 lines must be a standalone module.

---

### P0-3: Incomplete Routing & Missing Pages

**Observation:**
- `/reviews` — No dedicated page. Falls back to `index.html` via nginx try_files, serving the full homepage. The navbar links to `/#reviews` (correct anchor), but if a user navigates directly to `/reviews` they see the entire homepage without scroll context.
- `/dashboard` — Falls back to `index.html` identically. The navbar links to `https://dash.devgo.studio` (external), but `/dashboard` on the main domain is a dead end.
- `/about`, `/services`, `/contact` — Referenced in `llms.txt` but do not exist.
- **No custom 404 page** — nginx falls back to `index.html` for all unknown paths. This means `/anything` renders the full homepage, which is confusing and bad for SEO.
- The `timeline.astro` component is commented out in `index.astro` but remains in the codebase as an incomplete stub.

**Impact:**
- Users who bookmark or share `/reviews` or `/dashboard` get a confusing experience
- Search engines may index the homepage under multiple URLs (duplicate content penalty)
- `llms.txt` advertises non-existent pages to AI crawlers

**Constraint:**
- Create a dedicated 404 page with navigation links
- Either create redirect routes for `/reviews` → `/` and `/dashboard` → external, or create proper landing pages
- Fix `llms.txt` to reflect the actual page structure
- Remove `timeline.astro` or complete it — no half-built commented-out components

---

### P0-4: Unprofessional Review Content

**Observation:** Two of the four reviews in `src/lib/reviews.ts` appear to be placeholder/test data:
- `"Pizza Palace"` / `"777 Intl"` — Generic placeholder names
- `"Cookie$"` — No company, 4-word review: "Great to work with"

**Impact:**
- Directly undermines credibility
- The "4 reviews" badge in the navbar is inflated by placeholder content
- If a real client visits and sees these, it damages trust

**Constraint:** Every published review must be from a real, verifiable client. Remove or replace placeholder entries. Do not display a review count badge that includes placeholder data.

---

## High-Priority Improvements (P1)

### P1-1: Shared Animation & Rendering Module Architecture

Beyond extracting PIXI engines (P0-2), the entire animation initialization pattern is duplicated. Every `.astro` page that uses PIXI contains:
1. A feature-detection check for `prefers-reduced-motion`
2. A `window.addEventListener("load", ...)` pattern
3. Manual `canvas` and `wrapper` element lookups via `getElementById`
4. Resize debounce timers (sometimes named `resizeTimer`, sometimes unnamed)

**Constraint:** Create a unified `AnimationManager` utility that:
- Accepts a registry of `{ id, engine, wrapper }` entries
- Handles the `prefers-reduced-motion` check once
- Manages resize debouncing centrally
- Destroys all engines on page unload (or Astro View Transition)

---

### P1-2: View Transitions & Navigation UX

**Observation:** The site is an Astro MPA with full-page reloads between routes (Home, Case Studies, Showcase, individual case studies). The navbar does not highlight the active section. Anchor links (`/#reviews`, `/#top`) cause sharp scrolls without smooth transitions. When navigating from a case study back to `/case-studies`, the entire page reloads and re-runs all PIXI init scripts.

**Constraint:** Adopt Astro's View Transitions API (`<ViewTransitions />`) for:
- Cross-fade transitions between case study list ↔ individual case study
- Persistent PIXI contexts across navigation (avoid re-initialization)
- Active nav link state based on current route

**Boundary:** Do NOT use View Transitions for anchor-based scrolls within the homepage (those should remain instant). Only for cross-page navigation.

---

### P1-3: Image Performance & Optimization

**Observation:** 
- The hero background image is loaded as a data source for PIXI particle sampling (via `dataset.src`) — the full image is fetched, drawn to a temp canvas, sampled per-pixel, then discarded
- Showcase and featured project images are rendered via `<Image />` from `astro:assets` but lack explicit `width`/`height` attributes, causing layout shifts
- No responsive image breakpoints are defined — the same image is served to all viewport sizes
- Three identical image imports exist across `featured.ts`, `showcase.ts`, and `reviews.ts` — the same 3 project images imported in 3 different files

**Constraint:**
- Set explicit `width` and `height` on all `<Image />` components
- Define responsive image presets in `astro.config.mjs` for showcase and case study cover images
- Consolidate image imports into a single `src/assets/images.ts` manifest
- Use `loading="lazy"` and `decoding="async"` for below-fold images consistently

---

### P1-4: SEO & Structured Data Gaps

**Observation:**
- Organization schema has empty `sameAs` array despite having social links defined in `values.ts`
- Case study pages lack `Article` structured data (only generic OG tags)
- No breadcrumb schema
- `llms.txt` lists non-existent pages (`/about`, `/services`, `/contact`)
- `robots.txt` includes `Disallow: /draft/` but no such path exists
- Missing `lastmod`, `changefreq`, and `priority` attributes in sitemap entries

**Constraint:**
- Populate `sameAs` with social media URLs from `values.ts`
- Add `Article` schema to case study pages via `seo.astro`
- Fix `llms.txt` to match actual routes
- Remove unused disallow rules from `robots.txt`
- Enhance sitemap with `lastmod` based on git history or build date

---

## Medium-Priority Improvements (P2)

### P2-1: Contact Form Instead of mailto:

The only contact mechanism is a `mailto:official@devgo.studio` link. This is unreliable (depends on user's email client), provides no spam protection, and offers no way to track inquiries.

**Constraint:** Add a contact form (could be serverless via Resend, Netlify Forms, or a simple Astro API route). Do NOT expose the email address in plain HTML to avoid spam harvesting. Keep the mailto link as a fallback.

---

### P2-2: Mobile Navigation Accessibility

**Observation:** The mobile menu uses a checkbox hack (`<input type='checkbox' id='menu-toggle' class='peer sr-only'/>`) with a `<label>`. While functional, this pattern:
- Has no `aria-expanded` state
- Has no `aria-controls` relationship
- Does not trap focus within the open menu
- Does not close on Escape key press

**Constraint:** The mobile menu must be keyboard-accessible with proper ARIA attributes. Acceptable patterns: checkbox hack + ARIA enhancement, or a JS-driven disclosure widget with focus trapping.

---

### P2-3: Canvas Accessibility — No Fallback Content

**Observation:** The hero, services, showcase, and case study pages all render animated PIXI.js backgrounds on `<canvas>` elements. Canvas elements have zero accessible content — screen readers perceive nothing.

**Constraint:** For every decorative canvas:
- Add `role="presentation"` or `aria-hidden="true"` to prevent screen reader confusion
- Provide a static CSS background fallback for users with `prefers-reduced-motion`
- Ensure all text content is rendered in DOM elements outside the canvas, not drawn onto the canvas (this is already the case — confirm and enforce)

---

### P2-4: Review Component "See More" — CSS Transition Cleanup

**Observation:** The review "see more" button in `review.astro` measures expanded height by creating a temporary DOM element, appending it to `document.body`, and removing it on every click. This is fragile and could cause layout thrashing.

**Constraint:** Replace the `measureHeight()` helper with a CSS-only approach using `max-height` and `overflow: hidden`, or cache the measured height on first interaction.

---

### P2-5: Data Consistency — Three Separate Manifest Files

**Observation:** Three files define the same 3 projects in different shapes:
- `src/lib/featured.ts` — `FeaturedProject[]` with `image`, `tags`, `link`
- `src/lib/showcase.ts` — `Project[]` with `image`, `url`, `year`
- `src/content/case-studies/*.mdx` — full case study content with frontmatter

Each file imports the same 3 PNG images independently.

**Constraint:** Consolidate to a single source of truth. Case studies in MDX are the canonical source. `featured.ts` and `showcase.ts` should derive their data from the content collection or a shared manifest, not duplicate project metadata.

---

### P2-6: Missing Privacy Policy & Terms Pages

No privacy policy, terms of service, or cookie notice — required for GDPR and CCPA compliance if collecting analytics.

**Constraint:** Add minimal privacy and terms pages. Link them in the footer.

---

## Low-Priority / Nice-to-Have (P3)

### P3-1: PIXI.js Bundle Size

PIXI.js v8 is ~500KB gzipped. It is loaded as a client-side `<script>` in 5 page types. Consider:
- Dynamically importing PIXI only when the canvas is in the viewport (IntersectionObserver)
- Or evaluating lighter alternatives (CSS animations, canvas 2D) for simpler effects

### P3-2: TailwindCSS v4 Configuration Audit

Tailwind v4 uses CSS-first configuration. The current `global.css` defines theme tokens inline. Verify there are no unused CSS variables or conflicting utility classes.

### P3-3: Case Study Image Missing-State Handling

The case study listing (`case-studies.astro`) shows a gradient placeholder (`bg-linear-to-br from-gray-700 to-gray-900`) when `entry.data.image` is absent. This is correct, but the placeholder does not match the site's color scheme.

### P3-4: Docker Image Optimization

The Dockerfile uses multi-stage builds correctly. However:
- `bun install --frozen-lockfile` is good
- The `CACHEBUST` arg forces rebuild of all layers — consider copying `src/` and `public/` before `COPY . .` to cache dependencies
- Add `.dockerignore` entries for `node_modules`, `.git`, `dist`, `docs`

### P3-5: OG Image Generation

The SEO component references `/og-image.png` (static). Consider auto-generating OG images for case study pages using a library like `satori` or Astro's built-in `getImage` to create per-page social preview images.

### P3-6: Dark Mode Only — No Light Mode

The site is dark-mode only (`bg: #040906`). This is a valid design choice but should be documented. Some users may expect a light mode toggle.

---

## Architectural Boundaries & Constraints

### Monorepo Boundary

The project at `/Users/adrianbonpin/Documents/Code/devgo/www` is the main marketing/portfolio site (`devgo.studio`). It is distinct from:
- `dash.devgo.studio` — external dashboard (linked from navbar)
- `analytics.devgo.studio` — external analytics (currently down)

**Constraint:** No backend logic or API routes in the www project. It is a static Astro site with client-side interactivity only.

### Component Architecture

```
src/
├── components/
│   ├── landing/          # Homepage-specific sections (hero, stats, services, featured, reviews, timeline)
│   ├── case-study/       # Case study page components (TOC, reading progress, meta)
│   ├── navbar.astro      # Shared navigation
│   ├── footer.astro      # Shared footer
│   └── seo.astro         # Shared metadata/structured data
├── layouts/
│   └── BaseLayout.astro  # Root layout (html, head, body wrapper)
├── pages/                # File-based routes
│   ├── index.astro       # Homepage
│   ├── case-studies.astro
│   ├── case-studies/[slug].astro
│   ├── showcase.astro
│   ├── robots.txt.ts
│   └── llms.txt.ts
├── content/
│   └── case-studies/     # MDX content collection
├── lib/                  # Shared data & utilities
│   ├── featured.ts       # Featured projects data
│   ├── reviews.ts        # Review data
│   ├── showcase.ts       # Showcase projects data
│   └── values.ts         # Links, services, social links
├── utils/
│   └── toc.ts            # Table of contents builder
├── types/
│   └── seo.ts            # SEO type definitions
├── styles/
│   └── global.css        # Tailwind v4 config + prose styles
└── assets/               # Static assets
    ├── fonts/
    ├── images/
    ├── logos/
    └── works/
```

**Constraint:** New shared rendering engines must live under `src/lib/engines/`. New layout-level components go in `src/components/`. Page-specific components remain colocated with their page.

### Data Flow

1. **Build time:** Astro processes `.astro` and `.mdx` files → generates static HTML
2. **Client-side hydration:** PIXI.js and anime.js run in-browser after page load
3. **Content:** Case studies in MDX → loaded via `getCollection("case-studies")` at build time
4. **External:** Analytics script (broken) loaded from `analytics.devgo.studio`

### Routing Contract

| URL Pattern | Handler | Status |
|---|---|---|
| `/` | `index.astro` | ✅ |
| `/case-studies/` | `case-studies.astro` | ✅ |
| `/case-studies/[slug]/` | `[slug].astro` | ✅ |
| `/showcase/` | `showcase.astro` | ✅ |
| `/robots.txt` | `robots.txt.ts` | ✅ |
| `/llms.txt` | `llms.txt.ts` | ✅ |
| `/404` | N/A (missing) | ❌ |
| `/reviews` | Falls to index | ❌ |
| `/dashboard` | Falls to index | ❌ |
| `/about`, `/services`, `/contact` | Falls to index | ❌ |

**Constraint:** Every route referenced in navigation, sitemap, or external links MUST have a page or explicit redirect. Unknown routes must render a 404 page, not the homepage.

---

## Security Requirements

### SEC-1: Analytics Script Integrity

The analytics script is loaded from an external domain (`analytics.devgo.studio`) without `integrity` or `crossorigin` attributes. If the analytics server becomes compromised, it could inject arbitrary JavaScript into every page.

**Requirement:** Either:
- Self-host the analytics script with SRI hash
- Add `integrity="sha384-..."` and `crossorigin="anonymous"` to the script tag
- Or remove analytics entirely if not needed

### SEC-2: External Links — rel Attributes

Social media and project links already use `rel="noopener noreferrer"` and `target="_blank"`. This is correct. Maintain this pattern for all external links.

### SEC-3: Contact Email Exposure

The email `official@devgo.studio` appears in:
- Navbar (`mailto:` link)
- Footer CTA (`mailto:` link)
- `llms.txt` (plain text)
- Potentially in structured data

**Requirement:** Minimize plain-text email exposure. Use a contact form as the primary contact method. Obfuscate or remove plain-text email from `llms.txt` if possible.

### SEC-4: No User Input Currently

The site has no forms, no API endpoints, and no user-generated content. If a contact form is added (P2-1), it must:
- Rate-limit submissions
- Validate and sanitize all inputs
- Use CSRF protection if stateful
- Never store submitted data in client-side storage

---

## Data Flow & Logic Architecture

### Current State

```
[Build Time]
MDX Files (case-studies/*.mdx)
  ↓ getCollection()
  ↓ Astro SSG
Static HTML + Inline JS Bundles
  ↓
[Nginx Container]
  ↓ Serves static files
  ↓ try_files → /index.html fallback (problematic)
[Browser]
  ↓ anime.js scroll animations
  ↓ PIXI.js canvas engines (multiple instances)
  ↓ Analytics script (external)
```

### Target State

```
[Build Time]
MDX Files (case-studies/*.mdx)
  ↓ getCollection()
  ↓ Astro SSG + View Transitions
Static HTML + Code-Split JS Bundles
  ↓
[Nginx Container]
  ↓ Serves static files with proper caching
  ↓ Custom 404 for unknown paths
  ↓ Redirect rules for legacy routes
[Browser]
  ↓ AnimationManager (centralized)
  ↓ PIXI Engine Registry (shared, lifecycle-managed)
  ↓ Analytics (self-hosted or removed)
```

---

## System Mapping

### Dependencies

| Dependency | Version | Usage | Risk |
|---|---|---|---|
| astro | 6.1.4 | SSG framework | Low |
| @astrojs/mdx | 5.0.3 | MDX content | Low |
| @astrojs/sitemap | 3.7.2 | Sitemap generation | Low |
| pixi.js | ^8.17.1 | Canvas animations | Medium — bundle size, multiple instances |
| animejs | ^4.3.6 | Scroll animations | Low |
| tailwindcss | ^4.2.2 | CSS framework | Low |
| lucide-astro | ^0.556.0 | Icons | Low |
| nginx:alpine | latest | Production serving | Low |
| oven/bun:1.2 | builder | Build stage | Low |

### External Services

| Service | URL | Status | Action |
|---|---|---|---|
| Analytics | `analytics.devgo.studio` | Active | Add SRI integrity hash |
| Dashboard | `dash.devgo.studio` | Unknown | Verify CORS/reachability |
| Social Media | Facebook, IG, GitHub, LinkedIn | Active | Verify links work |

---

## Implementation Priority Order

1. **P0-1**: Add SRI integrity to analytics script
2. **P0-4**: Clean review data
3. **P0-3**: Add 404 page + fix routing
4. **P0-2**: Extract PIXI engines into shared modules
5. **P1-2**: Add View Transitions
6. **P1-4**: Fix SEO/structured data
7. **P1-1**: Create AnimationManager
8. **P1-3**: Image optimization
9. **P2-1 → P2-6**: Medium-priority items
10. **P3-1 → P3-6**: Nice-to-have items

---

## Out of Scope (Explicitly)

- Redesign of visual assets or brand identity
- Backend API development for the www subdomain
- Migration away from Astro or PIXI.js
- Dashboard (dash.devgo.studio) development
- Analytics server repair (external dependency)
- Adding a CMS (the MDX-based content workflow is sufficient)
