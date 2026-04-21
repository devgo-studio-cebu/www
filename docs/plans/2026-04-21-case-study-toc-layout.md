# Case Study TOC & Layout Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add auto-generated chapter navigation (TOC) to case study detail pages with desktop sidebar and mobile sticky dropdown, improve visual layout, and fix all lint/build errors.

**Architecture:** The TOC is extracted from rendered MDX headings via an Astro component that uses `rehype` to collect heading IDs. On desktop (md:), a sticky left sidebar shows the chapter list with active section highlighting via Intersection Observer. On mobile, a sticky top bar below the navbar shows the current section and expands into a dropdown on tap. The case study layout is restructured to a 2-column grid with metadata displayed inline within the content area.

**Tech Stack:** Astro 6, Tailwind CSS 4, animejs (existing), lucide-astro (existing), Intersection Observer API (native browser), rehype-heading-id (Astro built-in via `@astrojs/mdx`)

---

## Phase 1: Fix All Lint & Build Errors

### Task 1: Fix unused @ts-expect-error in astro.config.mjs

**Files:**
- Modify: `astro.config.mjs:15-16`

**Step 1: Remove the unnecessary @ts-expect-error comment**

The Tailwind CSS Vite plugin types now match Astro's Vite config, so the directive is no longer needed.

```js
// BEFORE:
// @ts-expect-error Tailwind CSS Vite plugin types may not match Astro's Vite config
tailwindcss(),

// AFTER:
tailwindcss(),
```

**Step 2: Run astro check to verify the error is gone**

Run: `npx astro check 2>&1 | grep "error"`
Expected: No errors

**Step 3: Commit**

```bash
git add astro.config.mjs
git commit -m "fix: remove unused @ts-expect-error in astro config"
```

---

### Task 2: Fix unused imports across components

**Files:**
- Modify: `src/components/landing/reviews.astro:5`
- Modify: `src/components/landing/services.astro:173`
- Modify: `src/components/landing/timeline.astro:19`
- Modify: `src/components/landing/featured/project.astro:7`
- Modify: `src/pages/case-studies.astro:83`
- Modify: `src/pages/index.astro:5`
- Modify: `src/pages/case-studies/[slug].astro:25`
- Modify: `src/utils/seo.ts:1`

**Step 1: Fix reviews.astro - remove unused ArrowUpRight import**

```diff
- import { ArrowUpRight } from "lucide-astro"
```

**Step 2: Fix services.astro - remove unused wrapper parameter**

In the `FlowFieldBg` class constructor (line ~173), remove the unused `wrapper` parameter. Since it's a private field that's declared but never read, either use it or remove it. Check if wrapper is used elsewhere in the class - if not, remove it from the constructor.

```diff
constructor(
    private canvas: HTMLCanvasElement,
-   private wrapper: HTMLElement,
) {
```

And update the call site where `FlowFieldBg` is instantiated to not pass wrapper.

**Step 3: Fix timeline.astro - remove unused splitText import**

```diff
- import { animate, onScroll, splitText, stagger } from "animejs"
+ import { animate, onScroll, stagger } from "animejs"
```

**Step 4: Fix featured/project.astro - remove unused tags and link destructuring**

```diff
- const { title, image, tags, link } = Astro.props
+ const { title, image } = Astro.props
```

**Step 5: Fix case-studies.astro - remove unused stagger import**

```diff
- import { animate, onScroll, stagger, utils } from "animejs"
+ import { animate, onScroll, utils } from "animejs"
```

**Step 6: Fix index.astro - remove unused Timeline import**

```diff
- import Timeline from "../components/landing/timeline.astro"
```

**Step 7: Fix [slug].astro - remove unused client destructuring**

```diff
- const { title, subtitle, client, pubDate, year, category, services, image } =
+ const { title, subtitle, pubDate, year, category, services, image } =
```

**Step 8: Fix utils/seo.ts - remove unused WebsiteSchema import**

```diff
- import type { SEOProps, OrganizationSchema, WebsiteSchema, PersonSchema } from '../types/seo'
+ import type { SEOProps, OrganizationSchema, PersonSchema } from '../types/seo'
```

**Step 9: Run astro check to verify all warnings are resolved**

Run: `npx astro check 2>&1`
Expected: 0 errors, significantly fewer warnings

**Step 10: Commit**

```bash
git add -A
git commit -m "fix: remove unused imports and variables across codebase"
```

---

### Task 3: Fix seo.astro is:inline hints and deprecated z.string().url()

**Files:**
- Modify: `src/components/seo.astro:67,74`
- Modify: `src/content.config.ts:20`

**Step 1: Add is:inline directive to script tags in seo.astro**

```astro
<!-- Analytics -->
<script
    is:inline
    src='https://analytics.devgo.studio/api/script.js'
    data-site-id='ab2d9599be3f'
    defer
></script>

<!-- JSON-LD Schema -->
<script
    is:inline
    type='application/ld+json'
    set:html={JSON.stringify(generateJsonLd())}
/>
```

**Step 2: Replace deprecated z.string().url() in content.config.ts**

```diff
- link: z.string().url().optional(),
+ link: z.string().optional(),
```

Or use a regex-based URL validation instead if strict validation is needed.

**Step 3: Run astro check and build to verify**

Run: `npx astro check 2>&1 | grep -E "(error|warning)" && npx astro build 2>&1 | tail -5`
Expected: 0 errors, 0 warnings, successful build

**Step 4: Commit**

```bash
git add src/components/seo.astro src/content.config.ts
git commit -m "fix: add is:inline directives and replace deprecated url validator"
```

---

## Phase 2: Table of Contents Component

### Task 4: Create the TOC data extraction utility

**Files:**
- Create: `src/utils/toc.ts`

**Step 1: Write the TOC extraction utility**

This utility takes an array of heading elements (h2, h3) from the rendered content and builds a nested TOC structure.

```typescript
export interface TocItem {
    slug: string
    text: string
    depth: number
    children: TocItem[]
}

export function buildToc(headings: { depth: number; slug: string; text: string }[]): TocItem[] {
    const toc: TocItem[] = []
    const stack: TocItem[] = []

    for (const h of headings) {
        if (h.depth < 2 || h.depth > 3) continue

        const item: TocItem = {
            slug: h.slug,
            text: h.text,
            depth: h.depth,
            children: [],
        }

        if (h.depth === 2) {
            toc.push(item)
            stack.length = 0
            stack.push(item)
        } else if (h.depth === 3 && stack.length > 0) {
            stack[0].children.push(item)
        }
    }

    return toc
}
```

**Step 2: Commit**

```bash
git add src/utils/toc.ts
git commit -m "feat: add TOC extraction utility"
```

---

### Task 5: Create the desktop TOC sidebar component

**Files:**
- Create: `src/components/case-study/TocSidebar.astro`

**Step 1: Write the TocSidebar component**

This component renders a sticky sidebar with the chapter list. It receives the TOC items as props.

```astro
---
import type { TocItem } from "../../utils/toc"
import { FileText } from "lucide-astro"

interface Props {
    items: TocItem[]
    currentSlug?: string
}

const { items, currentSlug } = Astro.props
---

<nav
    class="hidden md:block md:col-span-2 lg:col-span-2 xl:col-span-2"
    aria-label="Table of contents"
>
    <div class="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-4 pl-2">
        <div class="flex items-center gap-2 mb-4 text-sm uppercase tracking-wider text-bg-secondary font-semibold">
            <FileText class="w-4 h-4" />
            <span>Chapters</span>
        </div>
        <ul class="space-y-1 text-sm">
            {items.map((item) => (
                <li>
                    <a
                        href={`#${item.slug}`}
                        class:list={[
                            "block py-1 px-2 rounded transition-colors hover:text-accent hover:bg-bg-secondary/10",
                            currentSlug === item.slug
                                ? "text-accent font-medium border-l-2 border-accent pl-3"
                                : "text-text/60",
                        ]}
                    >
                        {item.text}
                    </a>
                    {item.children.length > 0 && (
                        <ul class="ml-3 mt-1 space-y-0.5">
                            {item.children.map((child) => (
                                <li>
                                    <a
                                        href={`#${child.slug}`}
                                        class:list={[
                                            "block py-0.5 px-2 rounded text-xs transition-colors hover:text-accent hover:bg-bg-secondary/10",
                                            currentSlug === child.slug
                                                ? "text-accent font-medium border-l-2 border-accent pl-3"
                                                : "text-text/40",
                                        ]}
                                    >
                                        {child.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    </div>
</nav>
```

**Step 2: Commit**

```bash
git add src/components/case-study/TocSidebar.astro
git commit -m "feat: add desktop TOC sidebar component"
```

---

### Task 6: Create the mobile TOC sticky bar component

**Files:**
- Create: `src/components/case-study/TocMobile.astro`

**Step 1: Write the TocMobile component**

A sticky bar below the navbar that shows the current section name. Tapping reveals a dropdown list of all sections. Uses a checkbox hack for no-JS fallback, enhanced with client-side JS for active section tracking.

```astro
---
import type { TocItem } from "../../utils/toc"
import { ChevronDown, List } from "lucide-astro"

interface Props {
    items: TocItem[]
}

const { items } = Astro.props

const allItems = items.flatMap((item) => [
    item,
    ...item.children,
])
---

<div class="md:hidden sticky top-11 z-40 bg-bg/95 backdrop-blur-sm border-b border-bg-secondary">
    <input
        type="checkbox"
        id="toc-toggle"
        class="peer sr-only"
    />
    <label
        for="toc-toggle"
        class="flex items-center justify-between px-4 py-2 cursor-pointer text-sm"
    >
        <span class="flex items-center gap-2">
            <List class="w-4 h-4 text-bg-secondary" />
            <span id="toc-current" class="text-text/80 truncate">
                Chapters
            </span>
        </span>
        <ChevronDown class="w-4 h-4 text-bg-secondary transition-transform peer-checked:rotate-180" />
    </label>
    <div class="max-h-0 overflow-hidden peer-checked:max-h-[60vh] peer-checked:overflow-y-auto transition-all duration-300 ease-in-out">
        <ul class="px-4 pb-3 space-y-0.5 text-sm border-t border-bg-secondary/30">
            {items.map((item) => (
                <li>
                    <a
                        href={`#${item.slug}`}
                        class="toc-link block py-1.5 px-2 rounded text-text/60 hover:text-accent hover:bg-bg-secondary/10 transition-colors"
                    >
                        {item.text}
                    </a>
                    {item.children.length > 0 && (
                        <ul class="ml-3 space-y-0.5">
                            {item.children.map((child) => (
                                <li>
                                    <a
                                        href={`#${child.slug}`}
                                        class="toc-link block py-1 px-2 rounded text-xs text-text/40 hover:text-accent hover:bg-bg-secondary/10 transition-colors"
                                    >
                                        {child.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    </div>
</div>

<script>
    const tocLinks = document.querySelectorAll<HTMLAnchorElement>(".toc-link")
    const tocCurrent = document.getElementById("toc-current")
    const tocToggle = document.getElementById("toc-toggle") as HTMLInputElement | null

    tocLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (tocToggle) tocToggle.checked = false
        })
    })

    const headings = document.querySelectorAll("h2[id], h3[id]")
    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting && tocCurrent) {
                    tocCurrent.textContent = entry.target.textContent || "Chapters"
                }
            }
        },
        { rootMargin: "-20% 0px -70% 0px" }
    )

    headings.forEach((h) => observer.observe(h))
</script>
```

**Step 2: Commit**

```bash
git add src/components/case-study/TocMobile.astro
git commit -m "feat: add mobile TOC sticky bar component"
```

---

### Task 7: Add active section highlighting script for desktop TOC

**Files:**
- Create: `src/components/case-study/TocObserver.astro`

**Step 1: Write the TOC observer client script**

This script observes headings and updates the active TOC link styling in the desktop sidebar. It also handles smooth scrolling when TOC links are clicked.

```astro
---
---

<script>
    const desktopToc = document.querySelector<HTMLUListElement>("[aria-label='Table of contents'] ul")
    if (desktopToc) {
        const tocLinks = desktopToc.querySelectorAll<HTMLAnchorElement>("a")
        const headings = document.querySelectorAll("h2[id], h3[id]")

        function setActiveLink(slug: string) {
            tocLinks.forEach((link) => {
                const href = link.getAttribute("href")
                if (href === `#${slug}`) {
                    link.classList.add("text-accent", "font-medium", "border-l-2", "border-accent")
                    link.classList.remove("text-text/60", "text-text/40")
                    link.classList.add("pl-3")
                } else {
                    link.classList.remove("text-accent", "font-medium", "border-l-2", "border-accent")
                    link.classList.add("text-text/60")
                    link.classList.remove("pl-3")
                }
            })
        }

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveLink(entry.target.id)
                    }
                }
            },
            { rootMargin: "-15% 0px -75% 0px" }
        )

        headings.forEach((h) => observer.observe(h))

        tocLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault()
                const slug = link.getAttribute("href")?.slice(1)
                if (slug) {
                    const target = document.getElementById(slug)
                    if (target) {
                        target.scrollIntoView({ behavior: "smooth" })
                        setActiveLink(slug)
                    }
                }
            })
        })
    }
</script>
```

**Step 2: Commit**

```bash
git add src/components/case-study/TocObserver.astro
git commit -m "feat: add desktop TOC active section observer"
```

---

## Phase 3: Restructure Case Study Layout

### Task 8: Extract headings from MDX content and restructure [slug].astro

**Files:**
- Modify: `src/pages/case-studies/[slug].astro`

**Step 1: Add heading extraction and new layout structure**

The key change: use Astro's `render()` with `headingProperties` to extract headings, import the TOC components, and restructure the layout into a 2-column grid on desktop.

Replace the frontmatter and content area with:

```astro
---
import { getCollection, render } from "astro:content"
import BaseLayout from "../../layouts/BaseLayout.astro"
import { Image } from "astro:assets"
import TocSidebar from "../../components/case-study/TocSidebar.astro"
import TocMobile from "../../components/case-study/TocMobile.astro"
import TocObserver from "../../components/case-study/TocObserver.astro"
import { buildToc } from "../../utils/toc"
import { ArrowLeft } from "lucide-astro"

export async function getStaticPaths() {
    const caseStudies = await getCollection("case-studies")
    const isProd = import.meta.env.PROD

    return caseStudies
        .filter((entry) =>
            isProd ? !entry.filePath?.includes("/example.mdx") : true,
        )
        .map((entry) => ({
            params: { slug: entry.id.replace(/\.(md|mdx)$/, "") },
            props: { entry },
        }))
}

const { entry } = Astro.props
const { Content, headings } = await render(entry)

const { title, subtitle, pubDate, year, category, services, image } =
    entry.data

const tocItems = buildToc(
    headings.map((h) => ({
        depth: h.depth,
        slug: h.slug,
        text: h.text,
    }))
)
---
```

**Step 2: Update the HTML template**

Replace the entire `<BaseLayout>` body with the new structure:

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
    <section
        id='top'
        class='relative mt-11 md:mt-13 md:pt-20 pb-4 md:pb-10 w-full flex flex-col-reverse gap-4 md:flex-row md:px-6 overflow-hidden opacity-0'
    >
        <div class='wave-bg absolute inset-0 -z-1' id='wave-wrapper'>
            <canvas id='wave-canvas' class='w-full h-full'></canvas>
        </div>
        <div class=`w-full ${image ? "md:max-w-2/3" : ""}`>
            <a
                href='/case-studies'
                class='inline-flex items-center gap-1 text-sm text-bg-secondary hover:text-accent transition-colors mb-3'
            >
                <ArrowLeft class='w-4 h-4' />
                Case Studies
            </a>
            <h1 class='text-3xl md:5xl lg:text-7xl font-head uppercase'>
                {title}
            </h1>
            <h2 id='subtitle' class='md:text-lg font-medium'>
                {subtitle}
            </h2>
            <p id='year' class='font-semibold font-head tracking-wider text-sm md:text-base opacity-0'>
                {year}
            </p>
        </div>
        {image && (
            <div class='w-full md:max-w-1/3'>
                <Image src={image} alt='' />
            </div>
        )}
    </section>

    <TocMobile items={tocItems} />

    <section class='grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-6 px-2 md:px-6'>
        <TocSidebar items={tocItems} />
        <article
            id='content'
            class='md:col-span-10 prose prose-invert max-w-none prose-sm md:prose-base opacity-0 pb-10'
        >
            <Content />
        </article>
    </section>

    <TocObserver />
</BaseLayout>
```

**Step 3: Run build to verify**

Run: `npx astro build 2>&1 | tail -20`
Expected: Successful build with all case study pages generated

**Step 4: Commit**

```bash
git add src/pages/case-studies/[slug].astro
git commit -m "feat: add TOC sidebar and mobile dropdown to case study layout"
```

---

## Phase 4: Visual Improvements & Polish

### Task 9: Add inline metadata display to case study content

**Files:**
- Create: `src/components/case-study/CaseMeta.astro`

**Step 1: Write the CaseMeta component**

Displays client, category, services, and stack as styled inline tags below the hero.

```astro
---
import { Tag, Layers, Calendar } from "lucide-astro"

interface Props {
    year: number
    category: string
    services: string[]
    stack: string[]
}

const { year, category, services, stack } = Astro.props
---

<div class="flex flex-wrap gap-3 text-sm py-4 border-b border-bg-secondary/30 mb-6">
    <div class="flex items-center gap-1.5 text-bg-secondary">
        <Calendar class="w-3.5 h-3.5" />
        <span>{year}</span>
    </div>
    <div class="flex items-center gap-1.5 text-bg-secondary">
        <Tag class="w-3.5 h-3.5" />
        <span class="text-accent">{category}</span>
    </div>
    <div class="flex items-center gap-1.5 text-bg-secondary">
        <Layers class="w-3.5 h-3.5" />
        <div class="flex flex-wrap gap-1">
            {stack.map((tech, i) => (
                <span>
                    <span class="text-text/70">{tech}</span>
                    {i < stack.length - 1 && <span class="text-bg-secondary">·</span>}
                </span>
            ))}
        </div>
    </div>
</div>
```

**Step 2: Add CaseMeta to [slug].astro**

In the `[slug].astro` template, add the CaseMeta component inside the article, before the `<Content />`:

```astro
---
import CaseMeta from "../../components/case-study/CaseMeta.astro"
---

<!-- Inside the article element, before <Content /> -->
<CaseMeta year={year} category={category} services={services} stack={entry.data.stack} />
<Content />
```

**Step 3: Commit**

```bash
git add src/components/case-study/CaseMeta.astro src/pages/case-studies/[slug].astro
git commit -m "feat: add inline metadata display to case study pages"
```

---

### Task 10: Improve prose typography and spacing

**Files:**
- Modify: `src/styles/global.css`

**Step 1: Add case study specific prose overrides**

Add custom prose styles for the case study content area after the existing `@theme inline` block:

```css
@layer components {
    .prose h2 {
        @apply font-head uppercase tracking-wide text-lg md:text-2xl mt-12 mb-4 pb-2 border-b border-bg-secondary/20;
    }

    .prose h3 {
        @apply font-head uppercase tracking-wide text-base md:text-xl mt-8 mb-3;
    }

    .prose h2::before {
        content: "";
        @apply inline-block w-2 h-2 rounded-full bg-accent mr-2 align-middle;
    }

    .prose blockquote {
        @apply border-l-2 border-accent/40 pl-4 italic text-text/70;
    }

    .prose ul {
        @apply list-disc space-y-1;
    }

    .prose ol {
        @apply list-decimal space-y-1;
    }

    .prose strong {
        @apply text-accent font-bold;
    }

    .prose a {
        @apply text-accent hover:text-accent/80 underline underline-offset-2 transition-colors;
    }

    .prose code {
        @apply bg-bg-secondary/15 text-accent px-1.5 py-0.5 rounded text-xs md:text-sm;
    }

    .prose pre {
        @apply bg-bg-secondary/10 border border-bg-secondary/20 rounded-lg;
    }
}
```

**Step 2: Verify visual output**

Run: `npx astro dev` and visually inspect a case study page.
Expected: Improved typography with accent-colored headings, better spacing, and styled code blocks.

**Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: improve case study prose typography and spacing"
```

---

### Task 11: Add reading progress indicator

**Files:**
- Create: `src/components/case-study/ReadingProgress.astro`

**Step 1: Write the reading progress component**

A thin accent-colored progress bar fixed at the top of the page (below the navbar) that fills as the user scrolls through the article.

```astro
---
---

<div id="reading-progress" class="fixed top-11 md:top-13 left-0 w-full h-0.5 z-40 bg-bg-secondary/10">
    <div id="reading-progress-bar" class="h-full bg-accent/60 transition-[width] duration-150 ease-linear" style="width: 0%"></div>
</div>

<script>
    const progressBar = document.getElementById("reading-progress-bar")
    const article = document.querySelector("article")

    if (progressBar && article) {
        function updateProgress() {
            const rect = article.getBoundingClientRect()
            const articleTop = rect.top
            const articleHeight = rect.height
            const viewportHeight = window.innerHeight

            if (articleTop > viewportHeight) {
                progressBar!.style.width = "0%"
                return
            }

            const scrolled = viewportHeight - articleTop
            const progress = Math.min(Math.max(scrolled / articleHeight, 0), 1) * 100
            progressBar!.style.width = `${progress}%`
        }

        window.addEventListener("scroll", updateProgress, { passive: true })
        updateProgress()
    }
</script>
```

**Step 2: Add ReadingProgress to [slug].astro**

```astro
---
import ReadingProgress from "../../components/case-study/ReadingProgress.astro"
---

<!-- After <TocMobile /> -->
<ReadingProgress />
```

**Step 3: Commit**

```bash
git add src/components/case-study/ReadingProgress.astro src/pages/case-studies/[slug].astro
git commit -m "feat: add reading progress indicator to case studies"
```

---

### Task 12: Clean up the DesignSystem.astro placeholder

**Files:**
- Delete: `src/components/case-study/DesignSystem.astro`

**Step 1: Remove the empty placeholder component**

The `DesignSystem.astro` file is essentially empty (just a comment) and is not imported anywhere.

```bash
rm src/components/case-study/DesignSystem.astro
```

**Step 2: Verify build still works**

Run: `npx astro build 2>&1 | tail -5`
Expected: Successful build

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove unused DesignSystem placeholder component"
```

---

## Phase 5: Final Verification & Fixes

### Task 13: Run full lint and build verification

**Step 1: Run astro check**

Run: `npx astro check 2>&1`
Expected: 0 errors, 0 warnings

**Step 2: Run astro build**

Run: `npx astro build 2>&1`
Expected: Successful build, all case study pages generated

**Step 3: Run dev server and manually verify**

Run: `npx astro dev`

Verify the following:
1. Desktop (md:): TOC sidebar visible on left, active section highlighting works, smooth scroll on click
2. Mobile: Sticky TOC bar below navbar, dropdown expands/collapses, shows current section, closes on link click
3. Reading progress bar fills as you scroll
4. Inline metadata (year, category, stack) appears below hero
5. Back to Case Studies link works
6. Prose typography looks good with accent colors
7. All animations still work (hero entrance, content fade-in)
8. Reduced motion preference respected

**Step 4: Fix any remaining issues**

If any issues found during verification, fix them and re-run build.

**Step 5: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve remaining build and visual issues"
```

---

## Additional Improvements Recommended (Future Work)

These are improvements identified during analysis that are **not** included in this plan but are recommended for future iterations:

1. **Scroll-to-top button** - A floating button that appears when the user has scrolled past the hero, allowing quick navigation back to the top of the page.

2. **Case study listing page improvements** - The current `case-studies.astro` grid could benefit from:
   - Category filter/tabs (AI Automation, Website Development, etc.)
   - Hover animation on cards (scale, shadow, or color shift)
   - Load more / pagination if more case studies are added

3. **Breadcrumb navigation** - Instead of just a "Back to Case Studies" link, add a proper breadcrumb: `Home > Case Studies > [Title]` with structured data for SEO.

4. **Related case studies** - At the bottom of each case study, show 2-3 related case studies from the same category.

5. **Print stylesheet** - Add `@media print` rules so case studies print cleanly without the TOC, navbar, and particle backgrounds.

6. **Table of contents progress dots** - Small dots/indicators next to each TOC item showing which sections the user has already scrolled past (read vs unread).

7. **Estimated reading time** - Calculate and display estimated reading time based on word count in the hero section.

8. **Share buttons** - Allow sharing case studies on social media directly from the page.

9. **Image lightbox** - Make images in the prose content clickable to open in a full-screen lightbox view.

10. **Keyboard navigation** - Add keyboard shortcuts for navigating between TOC items (arrow keys when TOC is focused).
