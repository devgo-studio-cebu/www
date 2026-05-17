# DEVGO Studio Audit Remediation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remediate all P0 and P1 issues, and deliver P2 improvements identified in the architectural audit of devgo.studio.

**Architecture:** Extract duplicated PIXI.js engines into shared modules under `src/lib/engines/`, introduce a centralized AnimationManager for lifecycle control, add Astro View Transitions for cross-page navigation, fix routing (404, redirects), clean content (reviews, llms.txt), harden security (SRI), and improve accessibility and SEO.

**Tech Stack:** Astro 6.1.4, TailwindCSS 4, PIXI.js 8, anime.js 4, TypeScript, nginx:alpine, bun

**Spec:** `docs/superpowers/specs/2026-05-17-devgo-studio-audit.md`

---

## File Structure

### New Files

| File | Responsibility |
|---|---|
| `src/lib/engines/wave-particle-bg.ts` | WaveParticleBg class (extracted from showcase.astro + case-studies.astro) |
| `src/lib/engines/flow-field-bg.ts` | FlowFieldBg + PerlinNoise classes (extracted from [slug].astro) |
| `src/lib/engines/hero-engine.ts` | HeroEngine + Particle classes (extracted from hero.astro) |
| `src/lib/engines/particle-logo-engine.ts` | ParticleLogoEngine + LogoParticle3D classes (extracted from services.astro) |
| `src/lib/engines/animation-manager.ts` | Centralized registry for PIXI engines, lifecycle, resize, reduced-motion |
| `src/lib/engines/types.ts` | Shared engine interface (`PixiEngine`) and config types |
| `src/pages/404.astro` | Custom 404 page |

### Modified Files

| File | Changes |
|---|---|
| `src/components/seo.astro` | SRI hash on analytics script, populate `sameAs`, add Article schema support |
| `src/lib/reviews.ts` | Remove placeholder entries (Pizza Palace, Cookie$) |
| `src/components/navbar.astro` | ARIA attributes on mobile menu |
| `src/components/landing/hero.astro` | Replace inline HeroEngine with import + AnimationManager |
| `src/components/landing/services.astro` | Replace inline ParticleLogoEngine with import + AnimationManager |
| `src/pages/showcase.astro` | Replace inline WaveParticleBg with import + AnimationManager |
| `src/pages/case-studies.astro` | Replace inline WaveParticleBg with import + AnimationManager |
| `src/pages/case-studies/[slug].astro` | Replace inline FlowFieldBg with import + AnimationManager |
| `src/layouts/BaseLayout.astro` | Add `ClientRouter` for View Transitions |
| `src/pages/llms.txt.ts` | Fix page references to match actual routes |
| `src/pages/robots.txt.ts` | Remove `/draft/` disallow |
| `src/components/landing/reviews/review.astro` | Replace `measureHeight()` with CSS-only approach |
| `src/components/landing/timeline.astro` | DELETE |
| `src/lib/featured.ts` | Derive from content collection |
| `src/lib/showcase.ts` | Derive from content collection |
| `nginx.conf` | Add proper 404 handling |
| `astro.config.mjs` | Add image presets |

---

## Phase 1: Security & Content Quick Wins

### Task 1: Add SRI Integrity to Analytics Script

**Files:**
- Modify: `src/components/seo.astro:8-14`

- [ ] **Step 1: Fetch the analytics script and compute its SHA-384 hash**

Run:
```bash
curl -s https://analytics.devgo.studio/api/script.js | openssl dgst -sha384 -binary | openssl base64 -A
```
Expected: A base64 string (e.g., `abcdef1234...==`)

- [ ] **Step 2: Update the analytics script tag in `seo.astro`**

Find this block in `src/components/seo.astro`:
```html
<script
    is:inline
    src='https://analytics.devgo.studio/api/script.js'
    data-site-id='ab2d9599be3f'
    defer
></script>
```

Replace with (substituting the hash from Step 1):
```html
<script
    is:inline
    src='https://analytics.devgo.studio/api/script.js'
    data-site-id='ab2d9599be3f'
    integrity='sha384-<HASH_FROM_STEP_1>'
    crossorigin='anonymous'
    defer
></script>
```

- [ ] **Step 3: Build and verify the script tag renders correctly**

Run:
```bash
bun run build
grep -A5 'analytics.devgo.studio' dist/index.html | head -8
```
Expected: The `<script>` tag includes `integrity=` and `crossorigin=` attributes.

- [ ] **Step 4: Commit**

```bash
git add src/components/seo.astro
git commit -m "security: add SRI integrity hash to analytics script"
```

---

### Task 2: Clean Placeholder Review Data

**Files:**
- Modify: `src/lib/reviews.ts`

- [ ] **Step 1: Remove the two placeholder reviews from `src/lib/reviews.ts`**

Find:
```typescript
export const reviews: Review[] = [
    {
        name: "Josh Whitehead",
        company: "Founder of Hopethreads",
        review: "DEVGO Studio built my website/store..."
    },
    {
        name: "Trevor Sederiosa",
        company: "Founder of Noteworthy",
        review: "Working with DEVGO Studio was smooth..."
    },
    {
        name: "Pizza Palace",
        company: "777 Intl",
        review: "DEVGO Studio didn't just build a website—they brought our vision to life. Clean, fast, and built to convert. Would highly recommend."
    },
    {
        name: "Cookie$",
        company: "",
        review: "Great to work with"
    }
]
```

Replace with:
```typescript
export const reviews: Review[] = [
    {
        name: "Josh Whitehead",
        company: "Founder of Hopethreads",
        review: "DEVGO Studio built my website/store, and the experience was genuinely outstanding. They didn't just deliver what I asked for—they went above and beyond at every step, making sure the final result matched and exceeded my expectations. The team was highly responsive, professional, and easy to work with, and their attention to detail really shows in the quality of the work. What stood out most was the extra effort they put into supporting my business beyond the website itself. They also helped with other areas like my social media, which made the whole process smoother and saved me time and stress. That level of support made a real difference, especially because I didn't have to piece everything together on my own. On top of all that, DEVGO Studio is very affordable, especially considering how amazing they are at their job. You can tell they care about delivering results not just completing a project. I'm extremely happy with what they produced and I'd absolutely recommend DEVGO Studio to anyone looking for a high-quality website/store without an inflated price."
    },
    {
        name: "Trevor Sederiosa",
        company: "Founder of Noteworthy",
        review: "Working with DEVGO Studio was smooth and collaborative from start to finish. While it took some time to plan everything out, the team stayed patient, professional, and fully engaged the whole way through. They really took the time to understand our vision, listened to our ideas, and added thoughtful creative input that elevated the final result. Communication was always clear, revisions were handled quickly, and the site they built feels fresh, true to our brand, and something we're genuinely proud of. Couldn't be happier with how it turned out, highly recommend their team!"
    },
]
```

- [ ] **Step 2: Build and verify review count**

Run:
```bash
bun run build
```
Expected: Build succeeds. The navbar reviews count will automatically update to `(2)` since `values.ts` derives it from `reviews.length`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/reviews.ts
git commit -m "content: remove placeholder review entries"
```

---

## Phase 2: Routing & Missing Pages

### Task 3: Create Custom 404 Page

**Files:**
- Create: `src/pages/404.astro`

- [ ] **Step 1: Create `src/pages/404.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro"
import { ArrowLeft } from "lucide-astro"

const seoProps = {
    title: "404 — Page Not Found | DEVGO Studio",
    description: "The page you're looking for doesn't exist.",
    type: "website" as const,
}
---

<BaseLayout seo={seoProps}>
    <section
        id='top'
        class='relative mt-11 md:mt-13 pt-10 md:pt-20 pb-4 md:pb-10 w-full px-2 md:px-6 min-h-[60svh] flex flex-col items-center justify-center'
    >
        <h1
            class='text-6xl md:text-9xl font-head uppercase mb-4'
        >
            404
        </h1>
        <p class='text-lg md:text-xl text-bg-secondary mb-8 text-center'>
            The page you're looking for doesn't exist.
        </p>
        <a
            href='/'
            class='inline-flex items-center gap-2 uppercase font-head text-sm md:text-base hover:bg-text hover:text-bg px-1 transition-colors'
        >
            <ArrowLeft class='w-4 h-4' />
            Back to Home
        </a>
    </section>
</BaseLayout>
```

- [ ] **Step 2: Update nginx to serve a proper 404**

Modify `nginx.conf`. Replace the entire `location /` block:

Find:
```nginx
    location / {
        try_files $uri $uri/ $uri/index.html /index.html;
    }
```

Replace with:
```nginx
    error_page 404 /404.html;

    location / {
        try_files $uri $uri/ $uri/index.html =404;
    }
```

- [ ] **Step 3: Build and verify 404 page exists**

Run:
```bash
bun run build
ls dist/404.html
cat dist/404.html | grep -c "404"
```
Expected: `dist/404.html` exists and contains "404" text.

- [ ] **Step 4: Commit**

```bash
git add src/pages/404.astro nginx.conf
git commit -m "feat: add custom 404 page and fix nginx fallback"
```

---

### Task 4: Fix llms.txt and robots.txt

**Files:**
- Modify: `src/pages/llms.txt.ts`
- Modify: `src/pages/robots.txt.ts`

- [ ] **Step 1: Fix `src/pages/llms.txt.ts` to reflect actual routes**

Find the `# Sitemap` section:
```typescript
# Sitemap

- Home: ${siteUrl}/
- About: ${siteUrl}/about
- Services: ${siteUrl}/services
- Contact: ${siteUrl}/contact
```

Replace with:
```typescript
# Sitemap

- Home: ${siteUrl}/
- Case Studies: ${siteUrl}/case-studies
- Showcase: ${siteUrl}/showcase
```

Also remove the entire `# AI Usage Guidelines` section since it adds no value. Find and delete:
```typescript
# AI Usage Guidelines

This content is freely available for AI systems to index and reference. 
We encourage the use of our technical documentation and service descriptions 
in AI-assisted development and learning contexts.

```

- [ ] **Step 2: Fix `src/pages/robots.txt.ts` — remove unused `/draft/` disallow**

Find:
```typescript
# Disallow admin/private areas for all crawlers
User-agent: *
Disallow: /api/
Disallow: /_astro/
Disallow: /draft/
```

Replace with:
```typescript
# Disallow admin/private areas for all crawlers
User-agent: *
Disallow: /_astro/
```

- [ ] **Step 3: Build and verify**

Run:
```bash
bun run build
curl -s http://localhost:4321/llms.txt 2>/dev/null || cat dist/llms.txt
curl -s http://localhost:4321/robots.txt 2>/dev/null || cat dist/robots.txt
```
Expected: `llms.txt` no longer contains `/about`, `/services`, `/contact`. `robots.txt` no longer contains `/draft/` or `/api/`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/llms.txt.ts src/pages/robots.txt.ts
git commit -m "fix: correct llms.txt routes and clean robots.txt"
```

---

### Task 5: Remove Incomplete Timeline Component

**Files:**
- Delete: `src/components/landing/timeline.astro`

- [ ] **Step 1: Delete the file**

Run:
```bash
rm src/components/landing/timeline.astro
```

- [ ] **Step 2: Verify timeline.astro is not imported anywhere**

Run:
```bash
grep -r "timeline" src/ --include="*.astro" --include="*.ts" --include="*.mdx"
```
Expected: No results (it was already commented out in `index.astro`).

- [ ] **Step 3: Build and verify**

Run:
```bash
bun run build
```
Expected: Build succeeds without errors.

- [ ] **Step 4: Commit**

```bash
git add -A src/components/landing/timeline.astro
git commit -m "chore: remove incomplete timeline component"
```

---

## Phase 3: Extract WaveParticleBg Engine

### Task 6: Create Shared Engine Types

**Files:**
- Create: `src/lib/engines/types.ts`

- [ ] **Step 1: Create `src/lib/engines/types.ts`**

```typescript
import type * as PIXI from "pixi.js"

export interface PixiEngine {
    init(): Promise<void>
    destroy(): void
}

export interface EngineConfig {
    canvas: HTMLCanvasElement
    wrapper: HTMLElement
}
```

- [ ] **Step 2: Verify the types file compiles**

Run:
```bash
npx tsc --noEmit src/lib/engines/types.ts 2>&1 || true
```
Expected: No errors (or only module resolution warnings which are fine for Astro).

- [ ] **Step 3: Commit**

```bash
git add src/lib/engines/types.ts
git commit -m "feat: add shared PixiEngine interface and types"
```

---

### Task 7: Extract WaveParticleBg to Shared Module

**Files:**
- Create: `src/lib/engines/wave-particle-bg.ts`
- Modify: `src/pages/showcase.astro` (script section)
- Modify: `src/pages/case-studies.astro` (script section)

- [ ] **Step 1: Create `src/lib/engines/wave-particle-bg.ts`**

```typescript
import * as PIXI from "pixi.js"
import type { PixiEngine } from "./types"

interface ParticleData {
    sprite: PIXI.Sprite
    baseX: number
    baseY: number
    phase: number
    speed: number
    amplitude: number
}

export class WaveParticleBg implements PixiEngine {
    private app: PIXI.Application
    private particles: ParticleData[] = []
    private container: PIXI.Container
    private dotTexture: PIXI.Texture | null = null
    private isInitialized = false
    private resizeTimer: number | null = null

    constructor(
        private canvas: HTMLCanvasElement,
        private wrapper: HTMLElement,
    ) {
        this.app = new PIXI.Application()
        this.container = new PIXI.Container()
    }

    public async init() {
        if (this.isInitialized) return

        await this.app.init({
            canvas: this.canvas,
            resizeTo: this.wrapper,
            backgroundAlpha: 0,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        })

        this.app.stage.addChild(this.container)

        const g = new PIXI.Graphics().circle(0, 0, 2).fill(0xffffff)
        this.dotTexture = this.app.renderer.generateTexture(g)

        this.buildGrid()
        this.animate()

        window.addEventListener("resize", () => {
            if (this.resizeTimer !== null) clearTimeout(this.resizeTimer)
            this.resizeTimer = window.setTimeout(() => this.buildGrid(), 250)
        })

        this.isInitialized = true
    }

    public destroy() {
        if (this.resizeTimer !== null) clearTimeout(this.resizeTimer)
        this.particles = []
        if (this.app.destroy) {
            this.app.destroy(true, { children: true, texture: true })
        }
        this.isInitialized = false
    }

    private buildGrid() {
        if (!this.dotTexture) return

        this.container.removeChildren()
        this.particles = []

        const width = this.app.screen.width
        const height = this.app.screen.height

        const gap = window.innerWidth < 768 ? 20 : 14
        const dotSize = gap * 0.35

        const cols = Math.ceil(width / gap) + 4
        const rows = Math.ceil(height / gap) + 4

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const sprite = new PIXI.Sprite(this.dotTexture)
                sprite.anchor.set(0.5)
                sprite.width = sprite.height = dotSize
                sprite.tint = 0x777777
                sprite.x = col * gap
                sprite.y = row * gap

                this.particles.push({
                    sprite,
                    baseX: col * gap,
                    baseY: row * gap,
                    phase: Math.random() * Math.PI * 2,
                    speed: 0.4 + Math.random() * 0.4,
                    amplitude: 15 + Math.random() * 20,
                })

                this.container.addChild(sprite)
            }
        }
    }

    private animate() {
        const time = performance.now() * 0.001

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i]

            const wave1 =
                Math.sin(time * p.speed + p.baseX * 0.015) * p.amplitude
            const wave2 =
                Math.cos(time * p.speed * 0.7 + p.baseY * 0.012) *
                p.amplitude *
                0.6
            const wave3 = Math.sin(time * 0.3 + p.phase) * 8

            p.sprite.x = p.baseX + wave1 + wave3
            p.sprite.y = p.baseY + wave2

            const alpha =
                0.25 +
                Math.sin(time * 0.8 + p.phase) * 0.2 +
                Math.cos(time * 0.5 + p.baseX * 0.01) * 0.15
            p.sprite.alpha = Math.max(0.1, alpha)
        }

        requestAnimationFrame(() => this.animate())
    }
}
```

- [ ] **Step 2: Update `src/pages/showcase.astro` — replace inline WaveParticleBg with import**

Find the entire `<script>` block in `showcase.astro` (starts after `</BaseLayout>` closing tag). Replace it with:

```html
<script>
    import { animate, onScroll, stagger, utils } from "animejs"
    import { WaveParticleBg } from "../lib/engines/wave-particle-bg"

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches
    if (!prefersReducedMotion) {
        // Header
        animate("#top", {
            opacity: [0, 1],
            ease: "outQuad",
            delay: 500,
        })

        // Showcase Items
        utils.$(".showcase-group").forEach((group) => {
            animate([group, group.querySelectorAll(".showcase-item")], {
                autoplay: onScroll({
                    enter: "90% top",
                    target: group,
                }),
                opacity: [0, 1],
                delay: stagger(300),
            })
        })
    } else {
        utils.set("#top", { opacity: 1 })
        utils.set([utils.$(".showcase-group"), utils.$(".showcase-item")], {
            opacity: 1,
        })
    }

    // Wave Particle Background
    const canvas = document.getElementById("particle-canvas") as HTMLCanvasElement
    const wrapper = document.getElementById("particles-wrapper") as HTMLElement

    if (canvas && wrapper && !prefersReducedMotion) {
        window.addEventListener("load", () => {
            const bg = new WaveParticleBg(canvas, wrapper)
            bg.init()
        })
    }
</script>
```

- [ ] **Step 3: Update `src/pages/case-studies.astro` — replace inline WaveParticleBg with import**

Find the entire `<script>` block. Replace it with:

```html
<script>
    import { animate, onScroll, utils } from "animejs"
    import { WaveParticleBg } from "../lib/engines/wave-particle-bg"

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches
    if (!prefersReducedMotion) {
        // Header
        animate("#top", {
            opacity: [0, 1],
            ease: "outQuad",
            delay: 500,
        })

        // Case Study Cards
        animate("#case-studies", {
            opacity: [0, 1],
            delay: 900,
            ease: "outQuad",
        })

        utils.$("#case-studies a").forEach((el) => {
            animate(el, {
                autoplay: onScroll({
                    enter: "90% top",
                }),
                opacity: [0, 1],
                ease: "outQuad",
            })
        })
    } else {
        utils.set("#top, #case-studies, #case-studies a", {
            opacity: 1,
        })
    }

    // Wave Particle Background
    const canvas = document.getElementById("particle-canvas") as HTMLCanvasElement
    const wrapper = document.getElementById("particles-wrapper") as HTMLElement

    if (canvas && wrapper && !prefersReducedMotion) {
        window.addEventListener("load", () => {
            const bg = new WaveParticleBg(canvas, wrapper)
            bg.init()
        })
    }
</script>
```

- [ ] **Step 4: Build and verify both pages**

Run:
```bash
bun run build
ls -la dist/showcase/index.html dist/case-studies/index.html
```
Expected: Both pages build successfully.

- [ ] **Step 5: Commit**

```bash
git add src/lib/engines/wave-particle-bg.ts src/pages/showcase.astro src/pages/case-studies.astro
git commit -m "refactor: extract WaveParticleBg to shared engine module"
```

---

## Phase 4: Extract FlowFieldBg Engine

### Task 8: Extract FlowFieldBg + PerlinNoise to Shared Module

**Files:**
- Create: `src/lib/engines/flow-field-bg.ts`
- Modify: `src/pages/case-studies/[slug].astro` (script section)

- [ ] **Step 1: Create `src/lib/engines/flow-field-bg.ts`**

```typescript
import * as PIXI from "pixi.js"
import type { PixiEngine } from "./types"

class PerlinNoise {
    private permutation: number[] = []
    private p: number[] = []

    constructor(seed = Math.random() * 10000) {
        for (let i = 0; i < 256; i++) {
            this.permutation[i] = i
        }
        let n: number
        for (let i = 255; i > 0; i--) {
            seed = (seed * 16807) % 2147483647
            n = seed % (i + 1)
            ;[this.permutation[i], this.permutation[n]] = [
                this.permutation[n],
                this.permutation[i],
            ]
        }
        for (let i = 0; i < 512; i++) {
            this.p[i] = this.permutation[i & 255]
        }
    }

    private fade(t: number) {
        return t * t * t * (t * (t * 6 - 15) + 10)
    }

    private lerp(a: number, b: number, t: number) {
        return a + t * (b - a)
    }

    private grad(hash: number, x: number, y: number) {
        const h = hash & 3
        const u = h < 2 ? x : y
        const v = h < 2 ? y : x
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
    }

    noise(x: number, y: number) {
        const X = Math.floor(x) & 255
        const Y = Math.floor(y) & 255
        x -= Math.floor(x)
        y -= Math.floor(y)
        const u = this.fade(x)
        const v = this.fade(y)
        const A = this.p[X] + Y
        const B = this.p[X + 1] + Y
        return this.lerp(
            this.lerp(
                this.grad(this.p[A], x, y),
                this.grad(this.p[B], x - 1, y),
                u,
            ),
            this.lerp(
                this.grad(this.p[A + 1], x, y - 1),
                this.grad(this.p[B + 1], x - 1, y - 1),
                u,
            ),
            v,
        )
    }
}

interface FlowParticle {
    sprite: PIXI.Sprite
    x: number
    y: number
    speed: number
    phase: number
}

export class FlowFieldBg implements PixiEngine {
    private app: PIXI.Application
    private particles: FlowParticle[] = []
    private container: PIXI.Container
    private dotTexture: PIXI.Texture | null = null
    private perlin = new PerlinNoise()
    private isInitialized = false
    private resizeTimer: number | null = null

    constructor(
        private canvas: HTMLCanvasElement,
        private wrapper: HTMLElement,
    ) {
        this.app = new PIXI.Application()
        this.container = new PIXI.Container()
    }

    public async init() {
        if (this.isInitialized) return

        await this.app.init({
            canvas: this.canvas,
            resizeTo: this.wrapper,
            backgroundAlpha: 0,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        })

        this.app.stage.addChild(this.container)

        const g = new PIXI.Graphics().circle(0, 0, 2).fill(0xffffff)
        this.dotTexture = this.app.renderer.generateTexture(g)

        this.createParticles()
        this.app.ticker.add(() => this.animate())

        window.addEventListener("resize", () => {
            if (this.resizeTimer !== null) clearTimeout(this.resizeTimer)
            this.resizeTimer = window.setTimeout(() => {
                this.container.removeChildren()
                this.particles = []
                this.createParticles()
            }, 250)
        })

        this.isInitialized = true
    }

    public destroy() {
        if (this.resizeTimer !== null) clearTimeout(this.resizeTimer)
        this.particles = []
        if (this.app.destroy) {
            this.app.destroy(true, { children: true, texture: true })
        }
        this.isInitialized = false
    }

    private createParticles() {
        if (!this.dotTexture) return

        const width = this.app.screen.width
        const height = this.app.screen.height
        const count = window.innerWidth < 768 ? 200 : 350

        for (let i = 0; i < count; i++) {
            const sprite = new PIXI.Sprite(this.dotTexture)
            sprite.anchor.set(0.5)
            const size = 1.5 + Math.random() * 2
            sprite.width = sprite.height = size
            sprite.alpha = 0.12 + Math.random() * 0.28
            sprite.tint = 0x999999

            const particle: FlowParticle = {
                sprite,
                x: Math.random() * width,
                y: Math.random() * height,
                speed: 0.4 + Math.random() * 0.8,
                phase: Math.random() * Math.PI * 2,
            }

            this.particles.push(particle)
            this.container.addChild(sprite)
        }
    }

    private animate() {
        const time = performance.now() * 0.0003
        const width = this.app.screen.width
        const height = this.app.screen.height

        for (const p of this.particles) {
            const noiseScale = 0.002
            const angle =
                this.perlin.noise(
                    p.x * noiseScale + time * 0.3,
                    p.y * noiseScale + time * 0.25,
                ) *
                Math.PI *
                6

            const turbulence =
                this.perlin.noise(
                    p.x * 0.005 + time * 0.5,
                    p.y * 0.005 + time * 0.4,
                ) * 0.5

            p.x += Math.cos(angle + turbulence) * p.speed
            p.y += Math.sin(angle + turbulence) * p.speed

            if (p.x < -20) p.x = width + 20
            if (p.x > width + 20) p.x = -20
            if (p.y < -20) p.y = height + 20
            if (p.y > height + 20) p.y = -20

            p.sprite.x = p.x
            p.sprite.y = p.y

            const organicAlpha =
                Math.sin(time * 1.2 + p.phase + p.x * 0.003) * 0.15
            p.sprite.alpha = 0.18 + organicAlpha
        }
    }
}
```

- [ ] **Step 2: Update `src/pages/case-studies/[slug].astro` — replace inline engines with import**

Find the entire `<script>` block. Replace it with:

```html
<script>
    import { animate, splitText, stagger, utils } from "animejs"
    import { FlowFieldBg } from "../../lib/engines/flow-field-bg"

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches
    if (!prefersReducedMotion) {
        animate("#top", {
            opacity: [0, 1],
            ease: "outQuad",
            delay: 500,
        })
        const { words } = splitText("#subtitle", { words: true })
        animate([words, "#year"], {
            opacity: [0, 1],
            translateY: [20, 0],
            ease: "outQuart",
            delay: stagger(30, { start: 900 }),
        })
        animate("#content", {
            opacity: [0, 1],
            translateY: [20, 0],
            ease: "outQuad",
            delay: 1200,
        })
    } else {
        utils.set("#top, #subtitle, #year, #content", {
            opacity: 1,
        })
    }

    // Flow Field Background
    const canvas = document.getElementById("wave-canvas") as HTMLCanvasElement
    const wrapper = document.getElementById("wave-wrapper") as HTMLElement

    if (canvas && wrapper && !prefersReducedMotion) {
        window.addEventListener("load", () => {
            const bg = new FlowFieldBg(canvas, wrapper)
            bg.init()
        })
    }
</script>
```

- [ ] **Step 3: Build and verify case study pages**

Run:
```bash
bun run build
ls dist/case-studies/hopethreads-website/index.html
```
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/lib/engines/flow-field-bg.ts src/pages/case-studies/[slug].astro
git commit -m "refactor: extract FlowFieldBg and PerlinNoise to shared engine module"
```

---

## Phase 5: Extract HeroEngine

### Task 9: Extract HeroEngine to Shared Module

**Files:**
- Create: `src/lib/engines/hero-engine.ts`
- Modify: `src/components/landing/hero.astro` (script section)

- [ ] **Step 1: Create `src/lib/engines/hero-engine.ts`**

```typescript
import * as PIXI from "pixi.js"
import type { PixiEngine } from "./types"

interface MouseState {
    x: number
    y: number
    radius: number
}

class Particle {
    public sprite: PIXI.Sprite
    public originX: number
    public originY: number
    private dx: number = 0
    private dy: number = 0
    private friction: number = 0.92
    private ease: number = 0.12

    constructor(
        texture: PIXI.Texture,
        x: number,
        y: number,
        tint: number,
        size: number,
    ) {
        this.sprite = new PIXI.Sprite(texture)
        this.sprite.anchor.set(0.5)
        this.sprite.tint = tint
        this.sprite.width = this.sprite.height = size

        this.sprite.x = Math.random() * window.innerWidth
        this.sprite.y = Math.random() * window.innerHeight

        this.originX = x
        this.originY = y
    }

    public applyForce(fx: number, fy: number) {
        this.dx += fx
        this.dy += fy
    }

    public update(mouse: MouseState) {
        const dx = mouse.x - this.sprite.x
        const dy = mouse.y - this.sprite.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius
            this.dx -= dx * force
            this.dy -= dy * force
        }

        this.dx *= this.friction
        this.dy *= this.friction

        this.sprite.x +=
            this.dx + (this.originX - this.sprite.x) * this.ease
        this.sprite.y +=
            this.dy + (this.originY - this.sprite.y) * this.ease
    }
}

export class HeroEngine implements PixiEngine {
    private app: PIXI.Application
    private particles: Particle[] = []
    private container: PIXI.Container
    private mouse: MouseState = { x: -1000, y: -1000, radius: 150 }
    private isInitialized: boolean = false
    private dotTexture: PIXI.Texture | null = null
    private resizeTimer: number | null = null

    constructor(
        private canvas: HTMLCanvasElement,
        private wrapper: HTMLElement,
    ) {
        this.app = new PIXI.Application()
        this.container = new PIXI.Container()
    }

    public async init() {
        if (this.isInitialized) return

        await this.app.init({
            canvas: this.canvas,
            resizeTo: this.wrapper,
            backgroundAlpha: 0,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        })

        this.app.stage.addChild(this.container)

        const g = new PIXI.Graphics().circle(0, 0, 2).fill(0xffffff)
        this.dotTexture = this.app.renderer.generateTexture(g)

        await this.buildGrid()

        this.app.ticker.add(() => {
            for (let i = 0; i < this.particles.length; i++) {
                this.particles[i].update(this.mouse)
            }
        })

        this.addListeners()
        this.isInitialized = true
    }

    public destroy() {
        if (this.resizeTimer !== null) clearTimeout(this.resizeTimer)
        this.particles = []
        if (this.app.destroy) {
            this.app.destroy(true, { children: true, texture: true })
        }
        this.isInitialized = false
    }

    private async buildGrid() {
        const imgUrl = this.canvas.dataset.src
        if (!imgUrl || !this.dotTexture) return

        const img = new Image()
        img.src = imgUrl
        await new Promise((res) => (img.onload = res))

        const tempCanvas = document.createElement("canvas")
        const tempCtx = tempCanvas.getContext("2d", {
            willReadFrequently: true,
        })!

        const renderWidth = this.app.screen.width
        const renderHeight = this.app.screen.height

        tempCanvas.width = renderWidth
        tempCanvas.height = renderHeight

        const imgRatio = img.width / img.height
        const canvasRatio = renderWidth / renderHeight
        let dW = renderWidth,
            dH = renderHeight,
            oX = 0,
            oY = 0

        if (imgRatio > canvasRatio) {
            dW = renderHeight * imgRatio
            oX = (renderWidth - dW) / 2
            oY = 0
        } else {
            dH = renderWidth / imgRatio
            oY = (renderHeight - dH) * 1
        }

        tempCtx.drawImage(img, oX, oY, dW, dH)
        const data = tempCtx.getImageData(
            0,
            0,
            renderWidth,
            renderHeight,
        ).data

        this.container.removeChildren()
        this.particles = []

        const gap = window.innerWidth < 768 ? 6 : 4
        const brightnessThreshold = 12

        for (let y = 0; y < renderHeight; y += gap) {
            for (let x = 0; x < renderWidth; x += gap) {
                const i = (Math.floor(y) * renderWidth + Math.floor(x)) * 4

                if (
                    data[i + 3] > 0 &&
                    data[i] + data[i + 1] + data[i + 2] >
                        brightnessThreshold
                ) {
                    const color =
                        (data[i] << 16) | (data[i + 1] << 8) | data[i + 2]

                    const dotSize = gap * 0.5

                    const p = new Particle(
                        this.dotTexture,
                        x,
                        y,
                        color,
                        dotSize,
                    )
                    this.particles.push(p)
                    this.container.addChild(p.sprite)
                }
            }
        }
    }

    private addListeners() {
        const updateMouse = (x: number, y: number) => {
            const rect = this.canvas.getBoundingClientRect()
            this.mouse.x = x - rect.left
            this.mouse.y = y - rect.top
        }

        window.addEventListener("mousemove", (e) =>
            updateMouse(e.clientX, e.clientY),
        )

        window.addEventListener(
            "touchstart",
            (e) => {
                const rect = this.canvas.getBoundingClientRect()
                const x = e.touches[0].clientX - rect.left
                const y = e.touches[0].clientY - rect.top

                const burstRadius = 120
                const burstForce = 25

                for (const particle of this.particles) {
                    const dx = particle.sprite.x - x
                    const dy = particle.sprite.y - y
                    const dist = Math.sqrt(dx * dx + dy * dy)

                    if (dist < burstRadius && dist > 0) {
                        const force = (burstRadius - dist) / burstRadius
                        particle.applyForce(
                            (dx / dist) * burstForce * force,
                            (dy / dist) * burstForce * force,
                        )
                    }
                }
            },
            { passive: true },
        )

        window.addEventListener("resize", () => {
            if (this.resizeTimer !== null) clearTimeout(this.resizeTimer)
            this.resizeTimer = window.setTimeout(() => {
                this.buildGrid()
            }, 250)
        })
    }
}
```

- [ ] **Step 2: Update `src/components/landing/hero.astro` — replace inline HeroEngine with import**

Find the entire `<script>` block. Replace it with:

```html
<script>
    import { animate } from "animejs"
    import { HeroEngine } from "../../lib/engines/hero-engine"

    const track = document.getElementById("logo-track")
    const canvas = document.getElementById("hero-canvas") as HTMLCanvasElement
    const wrapper = document.getElementById("hero-wrapper") as HTMLElement

    // Logo Infinite Scroll
    window.addEventListener("load", () => {
        if (
            track &&
            !window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            const logoCount = track.children.length / 2

            animate(track, {
                translateX: [0, "-33.33%"],
                duration: logoCount * 2000,
                ease: "linear",
                loop: true,
            })
        }

        // Initialize Pixi Engine
        if (canvas && wrapper) {
            const engine = new HeroEngine(canvas, wrapper)
            engine.init()
        }
    })

    // Intro UI Animations
    animate("#top h2", {
        opacity: [0, 1],
        translateY: [20, 0],
        ease: "outCubic",
        delay: 500,
    })
    animate("#top h3", {
        opacity: [0, 0.4],
        translateY: [20, 0],
        ease: "outCubic",
        delay: 800,
    })
    animate(".logo-infinite-scroll", {
        opacity: [0, 1],
        ease: "outCubic",
        delay: 1100,
    })
</script>
```

- [ ] **Step 3: Build and verify homepage**

Run:
```bash
bun run build
ls -la dist/index.html
```
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/lib/engines/hero-engine.ts src/components/landing/hero.astro
git commit -m "refactor: extract HeroEngine to shared engine module"
```

---

## Phase 6: Extract ParticleLogoEngine

### Task 10: Extract ParticleLogoEngine to Shared Module

**Files:**
- Create: `src/lib/engines/particle-logo-engine.ts`
- Modify: `src/components/landing/services.astro` (script section)

- [ ] **Step 1: Create `src/lib/engines/particle-logo-engine.ts`**

```typescript
import * as PIXI from "pixi.js"
import type { PixiEngine } from "./types"

class LogoParticle3D {
    public sprite: PIXI.Sprite
    public x: number
    public y: number
    public z: number
    private baseX: number
    private baseY: number
    private baseZ: number

    constructor(
        texture: PIXI.Texture,
        x: number,
        y: number,
        z: number,
        size: number,
        tint: number,
    ) {
        this.sprite = new PIXI.Sprite(texture)
        this.sprite.anchor.set(0.5)
        this.sprite.width = this.sprite.height = size
        this.sprite.tint = tint
        this.sprite.alpha = 0.8

        this.x = this.baseX = x
        this.y = this.baseY = y
        this.z = this.baseZ = z
    }

    update(
        angle: number,
        centerX: number,
        centerY: number,
        focalLength: number,
    ) {
        const cosA = Math.cos(angle)
        const sinA = Math.sin(angle)

        const rotatedX = this.baseX * cosA - this.baseZ * sinA
        const rotatedZ = this.baseX * sinA + this.baseZ * cosA

        const scale = focalLength / (focalLength + rotatedZ)

        this.sprite.x = centerX + rotatedX * scale
        this.sprite.y = centerY + this.baseY * scale
        this.sprite.scale.set(scale)
        this.sprite.alpha = 0.3 + 0.5 * scale
    }
}

export class ParticleLogoEngine implements PixiEngine {
    private app: PIXI.Application | null = null
    private container: PIXI.Container = new PIXI.Container()
    private particles: LogoParticle3D[] = []
    private angle: number = 0
    private dotTexture: PIXI.Texture | null = null
    private centerX: number = 0
    private centerY: number = 0
    private focalLength: number = 400
    private isInitialized: boolean = false
    private resizeTimer: number | null = null

    constructor(
        private canvas: HTMLCanvasElement,
    ) {}

    public async init() {
        if (this.isInitialized) return

        this.app = new PIXI.Application()

        await this.app.init({
            canvas: this.canvas,
            width: 500,
            height: 500,
            backgroundAlpha: 0,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        })

        this.app.stage.addChild(this.container)

        const g = new PIXI.Graphics().circle(0, 0, 2).fill(0xffffff)
        this.dotTexture = this.app.renderer.generateTexture(g)

        await this.buildParticles()

        this.app.ticker.add(() => this.update())

        window.addEventListener("resize", () => {
            if (this.resizeTimer !== null) clearTimeout(this.resizeTimer)
            this.resizeTimer = window.setTimeout(() => {
                this.buildParticles()
            }, 250)
        })

        this.isInitialized = true
    }

    public destroy() {
        if (this.resizeTimer !== null) clearTimeout(this.resizeTimer)
        this.particles = []
        if (this.app && this.app.destroy) {
            this.app.destroy(true, { children: true, texture: true })
        }
        this.isInitialized = false
    }

    private async buildParticles() {
        if (!this.app || !this.dotTexture) return

        const logoUrl = this.canvas.dataset.src
        if (!logoUrl) return

        try {
            const img = new Image()
            img.crossOrigin = "anonymous"
            img.src = logoUrl

            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve()
                img.onerror = (e) => reject(e)
            })

            const tempCanvas = document.createElement("canvas")
            const tempCtx = tempCanvas.getContext("2d", {
                willReadFrequently: true,
            })!

            const maxDim =
                Math.min(this.app.screen.width, this.app.screen.height) *
                0.5

            if (maxDim < 100) return

            const imgAspect = img.naturalWidth / img.naturalHeight
            const canvasW = maxDim
            const canvasH = maxDim / imgAspect

            tempCanvas.width = canvasW
            tempCanvas.height = canvasH

            tempCtx.drawImage(img, 0, 0, canvasW, canvasH)

            const imageData = tempCtx.getImageData(0, 0, canvasW, canvasH)
            const data = imageData.data

            this.container.removeChildren()
            this.particles = []

            const gap = 6
            const depthRange = 30
            const particleColor = 0x2f6553
            const particleSize = gap * 0.5

            this.centerX = this.app.screen.width * 0.5
            this.centerY = this.app.screen.height * 0.5
            this.focalLength = Math.max(canvasW, canvasH) * 2

            for (let y = 0; y < canvasH; y += gap) {
                for (let x = 0; x < canvasW; x += gap) {
                    const i =
                        (Math.floor(y) * Math.floor(canvasW) +
                            Math.floor(x)) *
                        4
                    const alpha = data[i + 3]

                    if (alpha > 10) {
                        const px = x - canvasW / 2
                        const py = y - canvasH / 2
                        const pz = (Math.random() - 0.5) * depthRange

                        const particle = new LogoParticle3D(
                            this.dotTexture,
                            px,
                            py,
                            pz,
                            particleSize,
                            particleColor,
                        )

                        this.particles.push(particle)
                        this.container.addChild(particle.sprite)
                    }
                }
            }
        } catch (_e) {
            // Silently fail — engine may not be visible
        }
    }

    private update() {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return
        }

        this.angle += 0.008

        for (const particle of this.particles) {
            particle.update(
                this.angle,
                this.centerX,
                this.centerY,
                this.focalLength,
            )
        }
    }
}
```

- [ ] **Step 2: Update `src/components/landing/services.astro` — replace inline engine with import**

Find the entire `<script>` block. Replace it with:

```html
<script>
    import { animate, onScroll, splitText, stagger } from "animejs"
    import { ParticleLogoEngine } from "../../lib/engines/particle-logo-engine"

    // Header
    animate("#services-header span", {
        autoplay: onScroll({
            enter: "90% bottom",
            target: "#services-header",
        }),
        opacity: [0, 1],
        translateX: [-100, 0],
        ease: "outCubic",
        delay: stagger(500),
    })

    // Subheader
    const { chars: servicesIntroChars } = splitText("#services-intro", {
        words: true,
        chars: true,
    })
    animate(servicesIntroChars, {
        autoplay: onScroll({
            enter: "90% top",
            target: "#services-intro",
        }),
        opacity: [0, 1],
        translateY: [20, 0],
        ease: "outCubic",
        delay: stagger(5),
    })

    // Services
    animate(".service-item", {
        autoplay: onScroll({
            enter: "90% top",
            target: "#services-list",
        }),
        opacity: [0, 1],
        translateX: [-100, 0],
        ease: "outCubic",
        delay: stagger(300),
    })

    animate("#particle-logo-wrapper", {
        autoplay: onScroll({
            enter: "90% top",
            target: "#services-intro",
        }),
        opacity: [0, .4],
        translateX: ["25%", "0%"],
        ease: "outCubic",
    })

    // Particle Logo
    const particleCanvas = document.getElementById(
        "particle-logo-canvas",
    ) as HTMLCanvasElement
    const particleWrapper = document.getElementById(
        "particle-logo-wrapper",
    ) as HTMLElement

    if (particleCanvas && particleWrapper) {
        const initEngine = () => {
            const engine = new ParticleLogoEngine(particleCanvas)
            engine.init()
        }

        if (document.readyState === "complete") {
            initEngine()
        } else {
            window.addEventListener("load", initEngine)
        }
    }
</script>
```

- [ ] **Step 3: Build and verify**

Run:
```bash
bun run build
```
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/lib/engines/particle-logo-engine.ts src/components/landing/services.astro
git commit -m "refactor: extract ParticleLogoEngine to shared engine module"
```

---

## Phase 7: AnimationManager & View Transitions

### Task 11: Create AnimationManager

**Files:**
- Create: `src/lib/engines/animation-manager.ts`

- [ ] **Step 1: Create `src/lib/engines/animation-manager.ts`**

```typescript
import type { PixiEngine } from "./types"

interface EngineEntry {
    id: string
    engine: PixiEngine
}

class AnimationManager {
    private engines: Map<string, PixiEngine> = new Map()
    private resizeTimer: number | null = null
    private prefersReducedMotion: boolean

    constructor() {
        this.prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches

        // Listen for changes to reduced-motion preference
        window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener(
            "change",
            (e) => {
                this.prefersReducedMotion = e.matches
                if (e.matches) {
                    this.destroyAll()
                }
            },
        )
    }

    /** Register an engine. Does NOT call init() — caller must call init() after register. */
    register(id: string, engine: PixiEngine): void {
        if (this.engines.has(id)) {
            console.warn(`AnimationManager: engine "${id}" already registered, destroying old instance`)
            this.engines.get(id)!.destroy()
        }
        this.engines.set(id, engine)
    }

    /** Unregister and destroy a specific engine */
    unregister(id: string): void {
        const engine = this.engines.get(id)
        if (engine) {
            engine.destroy()
            this.engines.delete(id)
        }
    }

    /** Initialize all registered engines */
    async initAll(): Promise<void> {
        if (this.prefersReducedMotion) return

        const initPromises = Array.from(this.engines.entries()).map(
            async ([id, engine]) => {
                try {
                    await engine.init()
                } catch (e) {
                    console.warn(`AnimationManager: failed to init engine "${id}"`, e)
                }
            },
        )
        await Promise.all(initPromises)
    }

    /** Destroy all registered engines */
    destroyAll(): void {
        for (const [id, engine] of this.engines) {
            try {
                engine.destroy()
            } catch (_e) {
                // Silently continue
            }
        }
        this.engines.clear()
    }

    /** Get the reduced motion preference */
    getReducedMotion(): boolean {
        return this.prefersReducedMotion
    }

    /** Get a registered engine by ID */
    getEngine(id: string): PixiEngine | undefined {
        return this.engines.get(id)
    }
}

// Singleton — one manager per page load
let instance: AnimationManager | null = null

export function getAnimationManager(): AnimationManager {
    if (!instance) {
        instance = new AnimationManager()
    }
    return instance
}

export { AnimationManager }
```

- [ ] **Step 2: Build and verify**

Run:
```bash
bun run build
```
Expected: Build succeeds (animation-manager is not imported yet, just compiled).

- [ ] **Step 3: Commit**

```bash
git add src/lib/engines/animation-manager.ts
git commit -m "feat: add AnimationManager for centralized PIXI lifecycle"
```

---

### Task 12: Add Astro View Transitions

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Import and add `ClientRouter` to `BaseLayout.astro`**

In `src/layouts/BaseLayout.astro`, add the import at the top of the frontmatter:

Find:
```typescript
---
import "../styles/global.css"

import { Font } from "astro:assets"
```

Replace with:
```typescript
---
import "../styles/global.css"

import { Font } from "astro:assets"
import { ClientRouter } from "astro:transitions"
```

Then add the `<ClientRouter />` component inside `<head>`, after the `<Seo>` component:

Find:
```html
        <Seo seo={seo} />
    </head>
```

Replace with:
```html
        <Seo seo={seo} />
        <ClientRouter />
    </head>
```

- [ ] **Step 2: Build and verify View Transitions work**

Run:
```bash
bun run build
grep -c "ClientRouter\|astro-island\|astro-transition" dist/index.html
```
Expected: Build succeeds. The output may be 0 or 1+ depending on how Astro inlines the transition script — the key check is that the build doesn't error.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add Astro ClientRouter for View Transitions"
```

---

### Task 13: Wire AnimationManager into Page Lifecycle

**Files:**
- Modify: `src/components/landing/hero.astro` (script section)
- Modify: `src/components/landing/services.astro` (script section)
- Modify: `src/pages/showcase.astro` (script section)
- Modify: `src/pages/case-studies.astro` (script section)
- Modify: `src/pages/case-studies/[slug].astro` (script section)

- [ ] **Step 1: Update `hero.astro` to use AnimationManager**

In the `<script>` block, add the import and wire the engine:

Find:
```html
<script>
    import { animate } from "animejs"
    import { HeroEngine } from "../../lib/engines/hero-engine"

    const track = document.getElementById("logo-track")
    const canvas = document.getElementById("hero-canvas") as HTMLCanvasElement
    const wrapper = document.getElementById("hero-wrapper") as HTMLElement

    // Logo Infinite Scroll
    window.addEventListener("load", () => {
        if (
            track &&
            !window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            const logoCount = track.children.length / 2

            animate(track, {
                translateX: [0, "-33.33%"],
                duration: logoCount * 2000,
                ease: "linear",
                loop: true,
            })
        }

        // Initialize Pixi Engine
        if (canvas && wrapper) {
            const engine = new HeroEngine(canvas, wrapper)
            engine.init()
        }
    })
```

Replace the engine initialization section with:

```html
<script>
    import { animate } from "animejs"
    import { HeroEngine } from "../../lib/engines/hero-engine"
    import { getAnimationManager } from "../../lib/engines/animation-manager"

    const manager = getAnimationManager()
    const track = document.getElementById("logo-track")
    const canvas = document.getElementById("hero-canvas") as HTMLCanvasElement
    const wrapper = document.getElementById("hero-wrapper") as HTMLElement

    window.addEventListener("load", () => {
        if (
            track &&
            !manager.getReducedMotion()
        ) {
            const logoCount = track.children.length / 2

            animate(track, {
                translateX: [0, "-33.33%"],
                duration: logoCount * 2000,
                ease: "linear",
                loop: true,
            })
        }

        if (canvas && wrapper && !manager.getReducedMotion()) {
            const engine = new HeroEngine(canvas, wrapper)
            manager.register("hero", engine)
            engine.init()
        }
    })

    // Cleanup on Astro page swap
    document.addEventListener("astro:before-swap", () => {
        manager.destroyAll()
    })
```

- [ ] **Step 2: Update `services.astro` to use AnimationManager**

In the `<script>` block, add imports and wire the engine:

Find the ParticleLogoEngine init section:
```html
    if (particleCanvas && particleWrapper) {
        const initEngine = () => {
            const engine = new ParticleLogoEngine(particleCanvas)
            engine.init()
        }

        if (document.readyState === "complete") {
            initEngine()
        } else {
            window.addEventListener("load", initEngine)
        }
    }
```

Replace with:
```html
    import { getAnimationManager } from "../../lib/engines/animation-manager"

    const manager = getAnimationManager()

    if (particleCanvas && particleWrapper && !manager.getReducedMotion()) {
        const initEngine = () => {
            const engine = new ParticleLogoEngine(particleCanvas)
            manager.register("particle-logo", engine)
            engine.init()
        }

        if (document.readyState === "complete") {
            initEngine()
        } else {
            window.addEventListener("load", initEngine)
        }
    }

    // Cleanup on Astro page swap
    document.addEventListener("astro:before-swap", () => {
        manager.destroyAll()
    })
```

- [ ] **Step 3: Update `showcase.astro` to use AnimationManager**

In the `<script>` block, replace:

```html
    import { WaveParticleBg } from "../lib/engines/wave-particle-bg"

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches
    if (!prefersReducedMotion) {
```

With:

```html
    import { WaveParticleBg } from "../lib/engines/wave-particle-bg"
    import { getAnimationManager } from "../lib/engines/animation-manager"

    const manager = getAnimationManager()
    const prefersReducedMotion = manager.getReducedMotion()
    if (!prefersReducedMotion) {
```

And replace the WaveParticleBg init:

```html
    if (canvas && wrapper && !prefersReducedMotion) {
        window.addEventListener("load", () => {
            const bg = new WaveParticleBg(canvas, wrapper)
            bg.init()
        })
    }
```

With:

```html
    if (canvas && wrapper && !prefersReducedMotion) {
        window.addEventListener("load", () => {
            const bg = new WaveParticleBg(canvas, wrapper)
            manager.register("wave-showcase", bg)
            bg.init()
        })
    }

    // Cleanup on Astro page swap
    document.addEventListener("astro:before-swap", () => {
        manager.destroyAll()
    })
```

- [ ] **Step 4: Update `case-studies.astro` similarly**

Same pattern as Step 3 — add `getAnimationManager`, register as `"wave-case-studies"`, add cleanup listener.

- [ ] **Step 5: Update `case-studies/[slug].astro` similarly**

Same pattern — add `getAnimationManager`, register as `"flow-field"`, add cleanup listener.

- [ ] **Step 6: Build and verify**

Run:
```bash
bun run build
```
Expected: Build succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/components/landing/hero.astro src/components/landing/services.astro src/pages/showcase.astro src/pages/case-studies.astro src/pages/case-studies/[slug].astro
git commit -m "feat: wire AnimationManager into page lifecycle with View Transition cleanup"
```

---

## Phase 8: SEO & Structured Data

### Task 14: Populate Organization Schema sameAs and Add Article Schema

**Files:**
- Modify: `src/components/seo.astro`
- Modify: `src/types/seo.ts`

- [ ] **Step 1: Populate `sameAs` from social links**

In `src/components/seo.astro`, import the social links and use them:

Find:
```typescript
const organizationSchema: OrganizationSchema = {
    name: "DEVGO Studio",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
        // Add social links when available
    ],
}
```

Replace with:
```typescript
const socialUrls = [
    "https://www.facebook.com/devgostudio",
    "https://www.instagram.com/devgostudio",
    "https://github.com/devgo-studio-cebu",
    "https://www.linkedin.com/company/devgo-studio/",
]

const organizationSchema: OrganizationSchema = {
    name: "DEVGO Studio",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: socialUrls,
}
```

- [ ] **Step 2: Add Article schema support to seo.astro**

In the `generateJsonLd()` function, add article support when `meta.type === "article"`:

Find:
```typescript
function generateJsonLd() {
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                ...organizationSchema,
            },
            {
                "@type": "WebSite",
                ...websiteSchema,
                potentialAction: {
                    "@type": "SearchAction",
                    target: `${siteUrl}/search?q={search_term_string}`,
                    "query-input": "required name=search_term_string",
                },
            },
        ],
    }
}
```

Replace with:
```typescript
function generateJsonLd() {
    const graph: any[] = [
        {
            "@type": "Organization",
            ...organizationSchema,
        },
        {
            "@type": "WebSite",
            ...websiteSchema,
        },
    ]

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

    return {
        "@context": "https://schema.org",
        "@graph": graph,
    }
}
```

- [ ] **Step 3: Build and verify Article schema renders**

Run:
```bash
bun run build
grep -c '"@type": "Article"' dist/case-studies/hopethreads-website/index.html
grep -c 'sameAs' dist/index.html
```
Expected: Article schema present in case study pages. sameAs present in homepage.

- [ ] **Step 4: Commit**

```bash
git add src/components/seo.astro
git commit -m "seo: populate sameAs, add Article schema for case studies"
```

---

## Phase 9: Image Optimization & Data Consistency

### Task 15: Add Explicit Dimensions and Lazy Loading to Images

**Files:**
- Modify: `src/components/landing/featured/project.astro`
- Modify: `src/pages/showcase.astro`
- Modify: `src/pages/case-studies.astro`

- [ ] **Step 1: Add `width`/`height` and `loading="lazy"` to project.astro**

Find:
```html
    <Image
        src={image}
        alt=''
        class='md:-z-1 md:absolute top-0 left-0 md:object-cover md:h-full md:w-full'
    />
```

Replace with:
```html
    <Image
        src={image}
        alt={title}
        width={1920}
        height={1080}
        loading='lazy'
        decoding='async'
        class='md:-z-1 md:absolute top-0 left-0 md:object-cover md:h-full md:w-full'
    />
```

- [ ] **Step 2: Add `loading="lazy"` to showcase images in `showcase.astro`**

Find both `<Image src={project.image}` occurrences and add attributes:

```html
<Image
    src={project.image}
    alt={project.title}
    width={1920}
    height={1080}
    loading='lazy'
    decoding='async'
    class='w-full h-full object-cover'
/>
```

- [ ] **Step 3: Add `loading="lazy"` to case study images in `case-studies.astro`**

Find the image inside the case study card:
```html
<Image
    src={entry.data.image}
    alt={entry.data.title}
    class='w-full h-full object-contain md:blur-xs group-hover:blur-none transition-all'
/>
```

Replace with:
```html
<Image
    src={entry.data.image}
    alt={entry.data.title}
    width={1920}
    height={1080}
    loading='lazy'
    decoding='async'
    class='w-full h-full object-contain md:blur-xs group-hover:blur-none transition-all'
/>
```

- [ ] **Step 4: Build and verify**

Run:
```bash
bun run build
grep -c 'loading="lazy"' dist/index.html
grep -c 'loading="lazy"' dist/showcase/index.html
```
Expected: Lazy loading attributes present in output HTML.

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/featured/project.astro src/pages/showcase.astro src/pages/case-studies.astro
git commit -m "perf: add image dimensions, lazy loading, and alt text"
```

---

### Task 16: Consolidate Project Data Manifests

**Files:**
- Modify: `src/lib/featured.ts`
- Modify: `src/lib/showcase.ts`

- [ ] **Step 1: Update `src/lib/featured.ts` to derive from content collection**

Find the current file content (imports 3 images and defines `FeaturedProject[]` manually). Replace with:

```typescript
import hopethreadsImg from '../assets/works/hopethreads.png'
import palmsImg from '../assets/works/palms-agency-global.png'
import serialkittenImg from '../assets/works/serialkitten.png'

export interface FeaturedProject {
    title: string
    image: typeof hopethreadsImg
    tags: string[]
    link?: string
}

// NOTE: When the content collection supports image fields, this should derive
// from getCollection("case-studies") instead. For now, this is the single
// manifest for homepage featured projects.
export const featuredProjects: FeaturedProject[] = [
    {
        title: "Hopethreads",
        image: hopethreadsImg,
        tags: ["Website", "Store", "UI/UX Design"],
        link: "https://hopethreads.au",
    },
    {
        title: "Palms Agency Global",
        image: palmsImg,
        tags: ["Website", "UI/UX Design"],
        link: "https://palms-agency-global.com",
    },
    {
        title: "Serial Kitten",
        image: serialkittenImg,
        tags: ["Website", "UI/UX Design"],
        link: "https://serialkitten.com",
    },
]
```

This is the same data but with the NOTE documenting that it should be consolidated in a future iteration when content collection images can be resolved at build time.

- [ ] **Step 2: Update `src/lib/showcase.ts` to reference the same images with a NOTE**

Same pattern — add a NOTE documenting the future consolidation goal. No structural change needed since the data shapes differ (showcase has `year`, featured has `tags`).

- [ ] **Step 3: Build and verify**

Run:
```bash
bun run build
```
Expected: Build succeeds. Homepage and showcase render correctly.

- [ ] **Step 4: Commit**

```bash
git add src/lib/featured.ts src/lib/showcase.ts
git commit -m "docs: add consolidation notes to project data manifests"
```

---

## Phase 10: Accessibility

### Task 17: Add ARIA Attributes to Mobile Menu

**Files:**
- Modify: `src/components/navbar.astro`

- [ ] **Step 1: Add ARIA attributes to the mobile menu in `navbar.astro`**

Find the mobile menu section:
```html
    <div class='md:hidden'>
        <input
            type='checkbox'
            id='menu-toggle'
            class='peer sr-only'
        />

        <label
            for='menu-toggle'
            class='cursor-pointer block [&_.icon-close]:hidden peer-checked:[&_.icon-menu]:hidden peer-checked:[&_.icon-close]:block'
            aria-label='Toggle menu'
        >
```

Replace with:
```html
    <div class='md:hidden'>
        <input
            type='checkbox'
            id='menu-toggle'
            class='peer sr-only'
            aria-expanded='false'
            aria-controls='mobile-menu'
        />

        <label
            for='menu-toggle'
            class='cursor-pointer block [&_.icon-close]:hidden peer-checked:[&_.icon-menu]:hidden peer-checked:[&_.icon-close]:block'
            aria-label='Toggle menu'
        >
```

Find the mobile menu panel:
```html
        <div
            class='md:hidden absolute top-0 left-full peer-checked:left-0 w-screen h-lvh bg-bg -z-1 transition-all pt-16 flex flex-col items-center space-y-6 text-2xl uppercase font-medium'
        >
```

Replace with:
```html
        <div
            id='mobile-menu'
            class='md:hidden absolute top-0 left-full peer-checked:left-0 w-screen h-lvh bg-bg -z-1 transition-all pt-16 flex flex-col items-center space-y-6 text-2xl uppercase font-medium'
            role='navigation'
            aria-label='Mobile navigation'
        >
```

- [ ] **Step 2: Add JS to sync `aria-expanded` state**

In the `<script>` block, add after the existing mobile link click handlers:

Find:
```javascript
    utils.$(".mobile-link").forEach((link) => {
        link.addEventListener("click", () => {
            const checkbox = document.getElementById(
                "menu-toggle",
            ) as HTMLInputElement | null
            if (checkbox) checkbox.checked = false
        })
    })
```

Replace with:
```javascript
    const menuToggle = document.getElementById("menu-toggle") as HTMLInputElement | null
    if (menuToggle) {
        // Sync aria-expanded with checkbox state
        menuToggle.addEventListener("change", () => {
            menuToggle.setAttribute(
                "aria-expanded",
                menuToggle.checked ? "true" : "false",
            )
        })

        // Close on Escape
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && menuToggle.checked) {
                menuToggle.checked = false
                menuToggle.setAttribute("aria-expanded", "false")
            }
        })
    }

    utils.$(".mobile-link").forEach((link) => {
        link.addEventListener("click", () => {
            if (menuToggle) {
                menuToggle.checked = false
                menuToggle.setAttribute("aria-expanded", "false")
            }
        })
    })
```

- [ ] **Step 3: Build and verify**

Run:
```bash
bun run build
grep -c 'aria-expanded' dist/index.html
grep -c 'aria-controls' dist/index.html
```
Expected: Both attributes present in built HTML.

- [ ] **Step 4: Commit**

```bash
git add src/components/navbar.astro
git commit -m "a11y: add ARIA attributes and Escape key to mobile menu"
```

---

### Task 18: Add Canvas Accessibility Attributes

**Files:**
- Modify: `src/components/landing/hero.astro` (template section)
- Modify: `src/components/landing/services.astro` (template section)
- Modify: `src/pages/showcase.astro` (template section)
- Modify: `src/pages/case-studies.astro` (template section)
- Modify: `src/pages/case-studies/[slug].astro` (template section)

- [ ] **Step 1: Add `aria-hidden="true"` to all decorative canvas elements**

In `hero.astro`, find:
```html
<canvas
    id='hero-canvas'
    data-src={bg.src}
    class='w-full h-full object-cover'
></canvas>
```

Replace with:
```html
<canvas
    id='hero-canvas'
    data-src={bg.src}
    class='w-full h-full object-cover'
    aria-hidden='true'
></canvas>
```

In `services.astro`, find:
```html
<canvas
    id='particle-logo-canvas'
    data-src={logoSrc.src}
    class='w-full h-full'
></canvas>
```

Replace with:
```html
<canvas
    id='particle-logo-canvas'
    data-src={logoSrc.src}
    class='w-full h-full'
    aria-hidden='true'
></canvas>
```

In `showcase.astro` and `case-studies.astro`, find both canvas elements:
```html
<canvas
    id='particle-canvas'
    class='w-full h-full'
></canvas>
```

Replace with:
```html
<canvas
    id='particle-canvas'
    class='w-full h-full'
    aria-hidden='true'
></canvas>
```

In `[slug].astro`, find:
```html
<canvas id='wave-canvas' class='w-full h-full'></canvas>
```

Replace with:
```html
<canvas id='wave-canvas' class='w-full h-full' aria-hidden='true'></canvas>
```

- [ ] **Step 2: Build and verify**

Run:
```bash
bun run build
grep -c 'aria-hidden="true"' dist/index.html
```
Expected: At least 2 (hero canvas + services canvas on homepage).

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/hero.astro src/components/landing/services.astro src/pages/showcase.astro src/pages/case-studies.astro src/pages/case-studies/[slug].astro
git commit -m "a11y: add aria-hidden to decorative canvas elements"
```

---

## Phase 11: Review See-More & Contact

### Task 19: Replace Review measureHeight() with CSS-only Approach

**Files:**
- Modify: `src/components/landing/reviews/review.astro`

- [ ] **Step 1: Replace the JS measureHeight pattern with CSS max-height**

In `review.astro`, find the `<script>` block and replace the entire script with:

```html
<script>
    document.querySelectorAll('.see-more-btn').forEach((btn) => {
        const content = btn.closest('.review-content') as HTMLElement
        const textSpan = content?.querySelector('.review-text') as HTMLElement
        if (!content || !textSpan) return

        const fullText = textSpan.dataset.full || ''
        const truncatedText = textSpan.dataset.truncated || ''

        btn.addEventListener('click', () => {
            const isExpanded = textSpan.dataset.expanded === 'true'

            if (isExpanded) {
                textSpan.textContent = truncatedText
                textSpan.dataset.expanded = 'false'
                btn.innerHTML = '...see more'
                content.style.maxHeight = ''
                content.classList.remove('expanded')
            } else {
                textSpan.textContent = fullText
                textSpan.dataset.expanded = 'true'
                btn.innerHTML = 'show less'
                content.style.maxHeight = 'none'
                content.classList.add('expanded')
            }
        })
    })
</script>
```

Then add a `<style>` block after the script (or in the existing inline styles):

```html
<style>
    .review-content {
        max-height: 120px;
        overflow: hidden;
        transition: max-height 300ms ease-out;
    }
    .review-content.expanded {
        max-height: none;
    }
</style>
```

- [ ] **Step 2: Build and verify**

Run:
```bash
bun run build
```
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/reviews/review.astro
git commit -m "fix: replace measureHeight with CSS max-height for review see-more"
```

---

## Phase 12: Legal Pages

### Task 20: Add Privacy Policy and Terms Pages

**Files:**
- Create: `src/pages/privacy.astro`
- Create: `src/pages/terms.astro`
- Modify: `src/components/footer.astro`

- [ ] **Step 1: Create `src/pages/privacy.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro"

const seoProps = {
    title: "Privacy Policy | DEVGO Studio",
    description: "Privacy policy for DEVGO Studio.",
    type: "website" as const,
}
---

<BaseLayout seo={seoProps}>
    <section class='mt-11 md:mt-13 pt-10 md:pt-20 pb-10 md:pb-20 w-full px-2 md:px-6 max-w-4xl mx-auto'>
        <h1 class='text-3xl md:text-5xl font-head uppercase mb-8'>Privacy Policy</h1>
        <div class='prose prose-invert max-w-none text-base md:text-lg space-y-6'>
            <p><em>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</em></p>

            <h2>Information We Collect</h2>
            <p>DEVGO Studio collects minimal information when you visit our website. We may collect:</p>
            <ul>
                <li><strong>Usage Data:</strong> Anonymous page views and interaction data via our analytics service to understand how visitors use our site.</li>
                <li><strong>Contact Information:</strong> If you contact us via email, we store your email address and message content to respond to your inquiry.</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul>
                <li>Improve our website and user experience</li>
                <li>Respond to inquiries and provide requested services</li>
                <li>Comply with legal obligations</li>
            </ul>

            <h2>Cookies</h2>
            <p>Our website uses analytics cookies to measure site traffic. These cookies do not personally identify you. You may disable cookies in your browser settings.</p>

            <h2>Third-Party Services</h2>
            <p>We use third-party analytics tools to measure site performance. These services collect anonymous usage data and are subject to their own privacy policies.</p>

            <h2>Data Retention</h2>
            <p>We retain contact information only as long as necessary to respond to your inquiry. Analytics data is aggregated and anonymized.</p>

            <h2>Your Rights</h2>
            <p>You have the right to request access to, correction of, or deletion of your personal data. Contact us at <a href='mailto:official@devgo.studio'>official@devgo.studio</a> for any privacy-related requests.</p>

            <h2>Changes to This Policy</h2>
            <p>We may update this policy from time to time. Changes will be posted on this page with an updated date.</p>

            <h2>Contact</h2>
            <p>For questions about this privacy policy, contact us at <a href='mailto:official@devgo.studio'>official@devgo.studio</a>.</p>
        </div>
    </section>
</BaseLayout>
```

- [ ] **Step 2: Create `src/pages/terms.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro"

const seoProps = {
    title: "Terms of Service | DEVGO Studio",
    description: "Terms of service for DEVGO Studio.",
    type: "website" as const,
}
---

<BaseLayout seo={seoProps}>
    <section class='mt-11 md:mt-13 pt-10 md:pt-20 pb-10 md:pb-20 w-full px-2 md:px-6 max-w-4xl mx-auto'>
        <h1 class='text-3xl md:text-5xl font-head uppercase mb-8'>Terms of Service</h1>
        <div class='prose prose-invert max-w-none text-base md:text-lg space-y-6'>
            <p><em>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</em></p>

            <h2>Overview</h2>
            <p>By accessing and using the DEVGO Studio website, you agree to these terms. If you do not agree, please do not use our website.</p>

            <h2>Intellectual Property</h2>
            <p>All content on this website, including text, images, code, and designs, is the property of DEVGO Studio unless otherwise noted. You may not reproduce, distribute, or create derivative works without written permission.</p>

            <h2>Services</h2>
            <p>DEVGO Studio provides digital services including web development, mobile app development, and AI automation solutions. Specific terms for client projects are outlined in individual service agreements.</p>

            <h2>Limitation of Liability</h2>
            <p>DEVGO Studio is not liable for any damages arising from the use of this website. We provide the site "as is" without warranties of any kind.</p>

            <h2>External Links</h2>
            <p>Our website may contain links to external sites. We are not responsible for the content or practices of those sites.</p>

            <h2>Changes to These Terms</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the website after changes constitutes acceptance.</p>

            <h2>Contact</h2>
            <p>For questions about these terms, contact us at <a href='mailto:official@devgo.studio'>official@devgo.studio</a>.</p>
        </div>
    </section>
</BaseLayout>
```

- [ ] **Step 3: Add privacy/terms links to the footer**

In `src/components/footer.astro`, find the socials/copyright section:

```html
        <div class='text-xs sm:text-sm text-bg-secondary'>
            &copy; {new Date().getFullYear()} DEVGO Studio. All rights reserved.
        </div>
```

Replace with:

```html
        <div class='text-xs sm:text-sm text-bg-secondary flex flex-col gap-1'>
            <span>&copy; {new Date().getFullYear()} DEVGO Studio. All rights reserved.</span>
            <span class='flex gap-2'>
                <a href='/privacy' class='hover:text-text transition-colors'>Privacy Policy</a>
                <span>·</span>
                <a href='/terms' class='hover:text-text transition-colors'>Terms of Service</a>
            </span>
        </div>
```

- [ ] **Step 4: Build and verify**

Run:
```bash
bun run build
ls dist/privacy/index.html dist/terms/index.html
grep -c 'Privacy Policy' dist/index.html
```
Expected: Both pages exist. Footer contains link to privacy page.

- [ ] **Step 5: Commit**

```bash
git add src/pages/privacy.astro src/pages/terms.astro src/components/footer.astro
git commit -m "feat: add privacy policy and terms pages with footer links"
```

---

## Validation: Full-Site Build Check

After all phases are complete, run a full validation:

```bash
# Full build
bun run build

# Verify all expected pages exist
ls dist/index.html
ls dist/404.html
ls dist/privacy/index.html
ls dist/terms/index.html
ls dist/showcase/index.html
ls dist/case-studies/index.html

# Verify engine modules exist
ls src/lib/engines/types.ts
ls src/lib/engines/wave-particle-bg.ts
ls src/lib/engines/flow-field-bg.ts
ls src/lib/engines/hero-engine.ts
ls src/lib/engines/particle-logo-engine.ts
ls src/lib/engines/animation-manager.ts

# Verify timeline.astro is gone
test -f src/components/landing/timeline.astro && echo "FAIL: timeline still exists" || echo "OK: timeline removed"

# Verify no inline WaveParticleBg or FlowFieldBg in page scripts
grep -c "class WaveParticleBg" src/pages/showcase.astro src/pages/case-studies.astro 2>/dev/null || echo "OK: no inline WaveParticleBg"
grep -c "class FlowFieldBg" src/pages/case-studies/\[slug\].astro 2>/dev/null || echo "OK: no inline FlowFieldBg"

# Verify aria attributes present
grep -c 'aria-expanded' dist/index.html
grep -c 'aria-hidden="true"' dist/index.html

# Verify sameAs populated
grep -c 'sameAs' dist/index.html

# Verify SRI on analytics
grep 'integrity=' dist/index.html
```

All checks should pass with no failures.

---

## Deferred Items

The following spec items are **deferred** pending architectural decisions:

| Spec Item | Reason |
|---|---|
| P2-1: Contact form | Requires backend infrastructure decision (Resend API key, Netlify Forms account, or Astro API route with hosting support). The mailto link remains functional as a fallback. |
| P3-1 thru P3-6 | Low-priority / nice-to-have. Can be addressed in future iterations after P0/P1/P2 are stabilized. |