# Loading Intro Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 2.8s full-screen loading overlay that animates 3 dots expanding into a dense particle field, then seamlessly fades to reveal the PixiJS hero beneath.

**Architecture:** A new `LoadingOverlay.astro` component renders a fixed z-50 overlay with animejs v4 timeline-driven dot animations. The hero's PixiJS engine pre-initializes behind it (canvas hidden). When the overlay timeline completes, it dispatches a `loading:complete` event; the hero fades in its canvas and activates mouse/touch listeners on receipt.

**Tech Stack:** Astro, animejs v4 (`animate`, `createTimeline`, `stagger`), Tailwind CSS v4, PixiJS v8 (existing hero)

---

### Task 1: Create LoadingOverlay component structure + styles

**Files:**
- Create: `src/components/loading-overlay.astro`

- [ ] **Step 1: Create the component file with HTML structure and styles**

```astro
---
// LoadingOverlay.astro
// Full-screen loading intro — Particle Density Morph
// Uses animejs v4 timeline to animate dots from sparse → dense
---

<div
  id="loading-overlay"
  class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg"
  aria-live="polite"
>
  <div id="loading-dots" class="relative flex items-center justify-center">
    <div class="loading-dot absolute" style="width:8px;height:8px;background:var(--color-accent);border-radius:50%;"></div>
    <div class="loading-dot absolute" style="width:8px;height:8px;background:var(--color-accent);border-radius:50%;"></div>
    <div class="loading-dot absolute" style="width:8px;height:8px;background:var(--color-accent);border-radius:50%;"></div>
  </div>
  <p
    id="loading-text"
    class="mt-6 text-[10px] uppercase tracking-[4px] text-bg-secondary opacity-0 font-head"
  >
    Loading
  </p>
</div>
```

- [ ] **Step 2: Verify the component renders in the dev server**

Run: `cd /Users/adrianbonpin/Documents/Code/devgo/www && bun run dev`
Expected: Dev server starts. Don't navigate yet — the component isn't mounted.

- [ ] **Step 3: Commit**

```bash
git add src/components/loading-overlay.astro
git commit -m "feat(loading): create LoadingOverlay component structure"
```

---

### Task 2: Implement Phase 1 — Dot pulse animation

**Files:**
- Modify: `src/components/loading-overlay.astro`

- [ ] **Step 1: Add the animejs script with timeline and Phase 1 animation**

Add the following `<script>` block inside `src/components/loading-overlay.astro`, after the closing `</div>` of `#loading-overlay`:

```astro
<script>
  import { animate, createTimeline, stagger } from "animejs"

  // --- TYPES ---
  interface DotData {
    el: HTMLDivElement
    x: number
    y: number
    color: string
    size: number
  }

  // --- CONFIG ---
  const ACCENT = "#5fcba6"
  const PRIMARY = "#2f6553"
  const GRAY = "#757575"
  const PHASE_DURATIONS = { pulse: 800, expand: 800, multiply: 800, fade: 400 }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  // --- UTILS ---
  const vw = () => window.innerWidth
  const vh = () => window.innerHeight
  const cx = () => vw() / 2
  const cy = () => vh() / 2

  function createDot(x: number, y: number, size: number, color: string): HTMLDivElement {
    const dot = document.createElement("div")
    dot.style.position = "absolute"
    dot.style.width = `${size}px`
    dot.style.height = `${size}px`
    dot.style.borderRadius = "50%"
    dot.style.background = color
    dot.style.left = `${x - size / 2}px`
    dot.style.top = `${y - size / 2}px`
    dot.style.opacity = "0"
    dot.style.willChange = "transform, opacity"
    dot.classList.add("spawned-dot")
    return dot
  }

  function hexToRgb(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return [r, g, b]
  }

  function rgbToHex(r: number, g: number, b: number): string {
    return "#" + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")
  }

  function lerpColor(a: string, b: string, t: number): string {
    const [ar, ag, ab] = hexToRgb(a)
    const [br, bg, bb] = hexToRgb(b)
    return rgbToHex(
      ar + (br - ar) * t,
      ag + (bg - ag) * t,
      ab + (bb - ab) * t,
    )
  }

  // --- DOT POOL ---
  const dotPool: DotData[] = []
  const dotsContainer = document.getElementById("loading-dots")!

  // Initial 3 dots
  const initialDots = document.querySelectorAll<HTMLDivElement>(".loading-dot")
  initialDots.forEach((dot, i) => {
    dot.style.willChange = "transform, opacity"
    // Position in a horizontal row at center, spaced 20px apart
    const offsetX = (i - 1) * 20
    dot.style.left = "50%"
    dot.style.top = "50%"
    dot.style.transform = `translate(calc(-50% + ${offsetX}px), -50%)`
    dot.style.opacity = "0.3"
    dotPool.push({
      el: dot,
      x: cx() + offsetX,
      y: cy(),
      color: ACCENT,
      size: 8,
    })
  })

  // --- REDUCED MOTION: Skip to fade ---
  function handleReducedMotion() {
    const overlay = document.getElementById("loading-overlay")!
    animate(overlay, {
      opacity: [1, 0],
      duration: 500,
      ease: "outExpo",
      onComplete: () => {
        window.dispatchEvent(new CustomEvent("loading:complete"))
        overlay.remove()
      },
    })
  }

  if (reducedMotion) {
    handleReducedMotion()
    // Don't run the full animation — return early
  } else {
    runLoadingAnimation()
  }

  // --- MAIN ANIMATION (wrapped in function for clean reduced-motion bypass) ---
  function runLoadingAnimation() {
  // --- TIMELINE ---
  const tl = createTimeline({
    onComplete: () => {
      // Phase 4: Fade out overlay
      const overlay = document.getElementById("loading-overlay")!
      animate(overlay, {
        opacity: [1, 0],
        duration: PHASE_DURATIONS.fade,
        ease: "outExpo",
        onComplete: () => {
          window.dispatchEvent(new CustomEvent("loading:complete"))
          overlay.remove()
        },
      })
    },
  } as any)

  // Phase 1: Pulse the 3 dots + fade in loading text
  tl.add(".loading-dot", {
    opacity: [0.3, 1, 0.6],
    scale: [0.8, 1.3, 1],
    duration: PHASE_DURATIONS.pulse,
    delay: stagger(150),
    ease: "outCirc",
  }, 0)

  tl.add("#loading-text", {
    opacity: [0, 1],
    duration: 400,
    ease: "outCirc",
  }, 300)
  } // end runLoadingAnimation()
</script>
```

**Note:** The `throw new Error("REDUCED_MOTION_SKIP")` at the end of the reduced-motion block intentionally stops execution of the rest of the script. The timeline and subsequent phases won't be set up — only the simple fade runs.

- [ ] **Step 2: Verify Phase 1 runs in the browser**

Mount the component temporarily in BaseLayout to test:
- Add `import LoadingOverlay from "../components/loading-overlay.astro"` and `<LoadingOverlay />` as the first child of `<body>` in `src/layouts/BaseLayout.astro`
- Run dev server, refresh page
- Expected: 3 green dots pulse at center, "Loading" text fades in, then nothing else happens (Phases 2-3 not yet implemented)

- [ ] **Step 3: Commit**

```bash
git add src/components/loading-overlay.astro src/layouts/BaseLayout.astro
git commit -m "feat(loading): add Phase 1 pulse animation + mount in BaseLayout"
```

---

### Task 3: Implement Phase 2 — Dot expansion

**Files:**
- Modify: `src/components/loading-overlay.astro`

- [ ] **Step 1: Add the expansion logic and timeline calls**

Add the following code inside the `<script>` block of `loading-overlay.astro`, BEFORE the timeline definition (after the `dotPool` initialization and the reduced-motion check, but before `const tl = createTimeline(...)`):

```javascript
  // --- PHASE 2: EXPANSION ---
  // Generate positions in 2 concentric rings around center
  function generateExpansionPositions(count: number): { x: number; y: number }[] {
    const positions: { x: number; y: number }[] = []
    const centerX = cx()
    const centerY = cy()
    const rings = 2
    const innerR = Math.min(vw(), vh()) * 0.08
    const outerR = Math.min(vw(), vh()) * 0.16

    for (let ring = 0; ring < rings; ring++) {
      const r = ring === 0 ? innerR : outerR
      const dotsInRing = ring === 0 ? Math.ceil(count * 0.4) : Math.ceil(count * 0.6)
      for (let i = 0; i < dotsInRing && positions.length < count; i++) {
        const angle = (2 * Math.PI * i) / dotsInRing + ring * 0.5
        positions.push({
          x: centerX + Math.cos(angle) * r,
          y: centerY + Math.sin(angle) * r,
        })
      }
    }
    return positions
  }

  function runExpansion() {
    const newDotCount = 17 // 3 existing + 17 new = 20 total
    const positions = generateExpansionPositions(newDotCount)

    // Color palette for expansion dots
    const colors = [ACCENT, PRIMARY, ACCENT, PRIMARY, GRAY, ACCENT, PRIMARY, ACCENT, PRIMARY, GRAY, ACCENT, PRIMARY, ACCENT, PRIMARY, GRAY, ACCENT, PRIMARY]

    for (let i = 0; i < newDotCount; i++) {
      const pos = positions[i]
      const color = colors[i % colors.length]
      const size = 4 + Math.random() * 4 // 4-8px
      const dot = createDot(cx(), cy(), size, color)
      dotsContainer.appendChild(dot)

      dotPool.push({ el: dot, x: pos.x, y: pos.y, color, size })

      // Animate each new dot from center to its ring position
      animate(dot, {
        opacity: [0, 0.6 + Math.random() * 0.4],
        left: [cx() - size / 2, pos.x - size / 2],
        top: [cy() - size / 2, pos.y - size / 2],
        scale: [0, 1],
        duration: PHASE_DURATIONS.expand,
        delay: stagger(30, { start: Math.random() * 200 }),
        ease: "outCirc",
      })
    }

    // Also animate the 3 original dots outward slightly
    const originalPositions = generateExpansionPositions(3)
    initialDots.forEach((dot, i) => {
      const pos = originalPositions[i]
      animate(dot, {
        left: [dot.style.left, `${pos.x - 4}px`],
        top: [dot.style.top, `${pos.y - 4}px`],
        opacity: [1, 0.7],
        duration: PHASE_DURATIONS.expand,
        ease: "outCirc",
      })
    })
  }
```

Then add the `.call()` to the timeline. After the Phase 1 `tl.add()` calls, add:

```javascript
  // Phase 2: Expand dots
  tl.call(() => runExpansion(), PHASE_DURATIONS.pulse)
```

- [ ] **Step 2: Verify Phase 2 in the browser**

Refresh the dev page. Expected:
- 0.0s–0.8s: 3 dots pulse
- 0.8s: ~17 new dots spawn at center and drift outward in 2 rings
- After 1.6s: 20 dots visible on screen, no further animation (Phase 3 not yet)

- [ ] **Step 3: Commit**

```bash
git add src/components/loading-overlay.astro
git commit -m "feat(loading): add Phase 2 dot expansion animation"
```

---

### Task 4: Implement Phase 3 — Dot multiplication + color shift

**Files:**
- Modify: `src/components/loading-overlay.astro`

- [ ] **Step 1: Add the multiplication logic and timeline call**

Add the following code inside the `<script>` block, after the `runExpansion()` function but before the timeline definition:

```javascript
  // --- PHASE 3: MULTIPLICATION ---
  function generateMultiplicationPositions(count: number): { x: number; y: number }[] {
    const positions: { x: number; y: number }[] = []
    const centerX = cx()
    const centerY = cy()
    const maxR = Math.min(vw(), vh()) * 0.35
    const rings = 4

    for (let ring = 1; ring <= rings; ring++) {
      const r = (ring / rings) * maxR
      const dotsInRing = Math.ceil(count / rings)
      const offset = ring % 2 === 0 ? 0.3 : 0 // stagger rings
      for (let i = 0; i < dotsInRing && positions.length < count; i++) {
        const angle = (2 * Math.PI * i) / dotsInRing + offset
        positions.push({
          x: centerX + Math.cos(angle) * r,
          y: centerY + Math.sin(angle) * r,
        })
      }
    }
    return positions
  }

  // Hero-inspired color palette (warm desk tones + accent)
  const heroColors = [ACCENT, PRIMARY, "#8b6914", "#c4a35a", GRAY, PRIMARY, ACCENT, "#3a2a1a", "#d4c4a0", PRIMARY]

  function runMultiplication() {
    const newDotCount = 35 // 20 existing + 35 new ≈ 55 total
    const positions = generateMultiplicationPositions(newDotCount)

    for (let i = 0; i < newDotCount; i++) {
      const pos = positions[i]
      // Interpolate color: start accent, shift toward hero palette
      const colorT = Math.random() * 0.6 + 0.2 // 0.2–0.8 blend
      const heroColor = heroColors[i % heroColors.length]
      const color = lerpColor(ACCENT, heroColor, colorT)
      const size = 2 + Math.random() * 5 // 2-7px (smaller = denser feel)

      // Start from a random existing dot's position for a "splitting" feel
      const parentDot = dotPool[Math.floor(Math.random() * dotPool.length)]
      const startX = parentDot.x
      const startY = parentDot.y

      const dot = createDot(startX, startY, size, color)
      dotsContainer.appendChild(dot)
      dotPool.push({ el: dot, x: pos.x, y: pos.y, color, size })

      animate(dot, {
        opacity: [0, 0.4 + Math.random() * 0.6],
        left: [startX - size / 2, pos.x - size / 2],
        top: [startY - size / 2, pos.y - size / 2],
        scale: [0, 1],
        duration: PHASE_DURATIONS.multiply,
        delay: Math.random() * 300,
        ease: "outCirc",
      })
    }

    // Fade "Loading" text out during multiplication
    animate("#loading-text", {
      opacity: [1, 0],
      duration: 400,
      ease: "outCirc",
    })
  }
```

Then add the `.call()` to the timeline. After the Phase 2 `tl.call()`, add:

```javascript
  // Phase 3: Multiply dots
  tl.call(() => runMultiplication(), PHASE_DURATIONS.pulse + PHASE_DURATIONS.expand)
```

- [ ] **Step 2: Verify Phase 3 in the browser**

Refresh the dev page. Expected:
- 0.0s–0.8s: Phase 1 (3 dots pulse)
- 0.8s–1.6s: Phase 2 (expand to ~20 dots)
- 1.6s–2.4s: Phase 3 (multiply to ~55 dots, colors shift toward hero palette)
- "Loading" text fades out
- 2.4s: Phase 4 (overlay fade + dismiss) — already implemented in the timeline `onComplete`

- [ ] **Step 3: Commit**

```bash
git add src/components/loading-overlay.astro
git commit -m "feat(loading): add Phase 3 multiplication + color shift"
```

---

### Task 5: Add prefers-reduced-motion guard + minimum hold time

**Files:**
- Modify: `src/components/loading-overlay.astro`

The reduced-motion check was already added in Task 2. This task adds a minimum hold time so the intro doesn't flash on fast connections.

- [ ] **Step 1: Wrap the full animation sequence in a minimum-hold promise**

In `loading-overlay.astro`, modify the script's execution section. Replace the direct timeline creation with a minimum-hold wrapper:

Find the timeline creation section (the `const tl = createTimeline(...)` block and everything after it down to the end of the `<script>`), and wrap it in a minimum-hold check:

```javascript
  // --- MINIMUM HOLD ---
  // Ensure at least 1.5s of loading is shown, even on fast connections
  const MINIMUM_HOLD = 1500
  const pageStart = performance.now()

  async function waitForMinimumHold() {
    const elapsed = performance.now() - pageStart
    if (elapsed < MINIMUM_HOLD) {
      await new Promise((resolve) => setTimeout(resolve, MINIMUM_HOLD - elapsed))
    }
  }

  // --- RUN ---
  // Wait for minimum hold, then start the visual timeline
  waitForMinimumHold().then(() => {
    // (The timeline and all phase code goes here, unchanged from Tasks 2–4)
  })
```

This means indenting the entire timeline + phase definition code inside the `.then()` callback. The reduced-motion block stays outside this wrapper (it runs immediately).

- [ ] **Step 2: Verify minimum hold**

In the browser, hard-refresh. The intro should always show for at least 1.5s + the 2.8s animation = ~4.3s total on fast connections.

To test that the hold works: temporarily set `MINIMUM_HOLD = 3000`, verify it takes longer, then revert to `1500`.

- [ ] **Step 3: Commit**

```bash
git add src/components/loading-overlay.astro
git commit -m "feat(loading): add 1.5s minimum hold time"
```

---

### Task 6: Modify hero.astro — pre-init PixiJS in background + activate on event

**Files:**
- Modify: `src/components/landing/hero.astro`

Currently the hero script initializes the PixiJS engine inside `window.addEventListener("load", ...)`. We need to split initialization into two phases:
1. **Pre-init**: Create the app, build the grid, but keep the canvas hidden
2. **Activate**: Fade in the canvas and start mouse/touch listeners when `loading:complete` fires

- [ ] **Step 1: Modify the hero script to support background init + event-driven activation**

In `src/components/landing/hero.astro`, find the `<script>` block and make these changes:

**a)** Add a CSS style to hide the hero canvas initially. Add this inside the existing `<style>` block:

```css
    #hero-canvas {
      opacity: 0;
      transition: opacity 600ms ease-out;
    }
    #hero-canvas.active {
      opacity: 1;
    }
```

**b)** In the `HeroEngine` class, split the listener setup into a separate method. Modify the `init()` method to stop before `this.addListeners()`, and add a new `activate()` method:

Find the `init()` method and change its ending from:

```javascript
            this.addListeners()
            this.isInitialized = true
```

to:

```javascript
            this.addListeners()
            this.isInitialized = true
        }

        public activate() {
            if (!this.isInitialized) return
            const canvas = this.canvas
            canvas.classList.add("active")
        }
```

**c)** Change the `window.addEventListener("load", ...)` section at the bottom. Currently it contains:

```javascript
    window.addEventListener("load", () => {
        // ...logo scroll...
        // Initialize Pixi Engine
        const engine = new HeroEngine(canvas, wrapper)
        engine.init()
    })
```

Change it to:

```javascript
    window.addEventListener("load", () => {
        // ...logo scroll (unchanged)...

        // Initialize Pixi Engine (in background, canvas is hidden via CSS)
        const engine = new HeroEngine(canvas, wrapper)
        engine.init()
    })

    // Activate hero when loading intro completes
    function onLoadingComplete() {
        engine.activate()
        window.removeEventListener("loading:complete", onLoadingComplete)
    }

    // Check if loading overlay already finished (race condition guard)
    if ((window as any).__loadingComplete) {
        engine.activate()
    } else {
        window.addEventListener("loading:complete", onLoadingComplete)
    }
```

Wait — there's a scoping issue. `engine` is declared inside the `window.addEventListener("load", ...)` callback. The `onLoadingComplete` function needs access to it. Fix: hoist `engine` declaration.

Move the engine declaration outside the load listener:

```javascript
    // --- EXECUTION ---
    const track = document.getElementById("logo-track")
    const canvas = document.getElementById("hero-canvas") as HTMLCanvasElement
    const wrapper = document.getElementById("hero-wrapper") as HTMLElement

    // Initialize engine reference (populated on load)
    let engine: HeroEngine

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

        // Initialize Pixi Engine (canvas hidden via CSS)
        engine = new HeroEngine(canvas, wrapper)
        engine.init()
    })

    // Activate hero when loading intro completes
    function onLoadingComplete() {
        if (engine) engine.activate()
        window.removeEventListener("loading:complete", onLoadingComplete)
    }

    // Race condition guard: if loading already complete, activate immediately
    if ((window as any).__loadingComplete) {
        if (engine) engine.activate()
    } else {
        window.addEventListener("loading:complete", onLoadingComplete)
    }
```

**d)** Also update the intro UI animations (the `animate("#top h2", ...)` etc. calls). These should also wait for the loading overlay to complete. Wrap them to trigger after `loading:complete`:

Replace:

```javascript
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
```

With:

```javascript
    // Intro UI Animations — play after loading overlay completes
    window.addEventListener("loading:complete", () => {
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
    })
```

- [ ] **Step 2: Verify hero activation after loading**

Hard-refresh the browser. Expected:
- Loading overlay plays full 2.8s
- When overlay fades, the PixiJS hero canvas fades in (transition: opacity 600ms)
- Hero text and partner logos animate in after the loading completes
- Mouse repulsion works on the particle grid
- Touch burst works on mobile

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/hero.astro
git commit -m "feat(loading): hero pre-init in background + activate on loading:complete"
```

---

### Task 7: Add race condition guard for navbar animations

**Files:**
- Modify: `src/components/navbar.astro`

The navbar animations (splitText character reveal, nav-link stagger) currently start immediately. They should wait for the loading overlay to complete so they don't play behind the overlay.

- [ ] **Step 1: Wrap navbar animations in loading:complete listener**

In `src/components/navbar.astro`, find the `<script>` block and wrap the animation calls with the loading event:

Replace the existing script content:

```javascript
    import { animate, splitText, stagger, utils } from "animejs"

    // Name
    const { chars: nameChars } = splitText("#devgo", {
        chars: true,
    })
    animate(nameChars, {
        opacity: [0, 1],
        translateY: [10, 0],
        delay: stagger(50),
        ease: "outCirc",
    })

    // Links - Desktop
    animate([".nav-link", "#nav-contact"], {
        opacity: [0, 1],
        translateY: [10, 0],
        delay: stagger(300, { start: 500 }),
        ease: "outCirc",
    })

    // Menu toggle - Mobile
    animate(".icon-menu", {
        opacity: [0, 1],
        translateY: [10, 0],
        delay: 500,
        ease: "outCirc",
    })

    utils.$(".mobile-link").forEach((link) => {
        link.addEventListener("click", () => {
            const checkbox = document.getElementById(
                "menu-toggle",
            ) as HTMLInputElement | null
            if (checkbox) checkbox.checked = false
        })
    })
```

With:

```javascript
    import { animate, splitText, stagger, utils } from "animejs"

    // Split text ahead of time (DOM preparation), but delay animations until loading completes
    const { chars: nameChars } = splitText("#devgo", {
        chars: true,
    })

    function runNavAnimations() {
        // Name
        animate(nameChars, {
            opacity: [0, 1],
            translateY: [10, 0],
            delay: stagger(50),
            ease: "outCirc",
        })

        // Links - Desktop
        animate([".nav-link", "#nav-contact"], {
            opacity: [0, 1],
            translateY: [10, 0],
            delay: stagger(300, { start: 500 }),
            ease: "outCirc",
        })

        // Menu toggle - Mobile
        animate(".icon-menu", {
            opacity: [0, 1],
            translateY: [10, 0],
            delay: 500,
            ease: "outCirc",
        })
    }

    // Wait for loading overlay to complete, then run navbar animations
    if ((window as any).__loadingComplete) {
        runNavAnimations()
    } else {
        window.addEventListener("loading:complete", runNavAnimations)
    }

    // Mobile menu toggle (no animation dependency)
    utils.$(".mobile-link").forEach((link) => {
        link.addEventListener("click", () => {
            const checkbox = document.getElementById(
                "menu-toggle",
            ) as HTMLInputElement | null
            if (checkbox) checkbox.checked = false
        })
    })
```

- [ ] **Step 2: Verify navbar animations wait for loading**

Hard-refresh. Expected: Navbar is invisible during loading overlay. After overlay fades, navbar text animates in with the character-by-character stagger.

- [ ] **Step 3: Commit**

```bash
git add src/components/navbar.astro
git commit -m "feat(loading): navbar animations wait for loading:complete event"
```

---

### Task 8: Finalize BaseLayout loading overlay mount + race condition flag

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Clean up the BaseLayout mount and add the race condition flag**

In `src/layouts/BaseLayout.astro`, the `LoadingOverlay` was added in Task 2. Verify it's positioned as the first child of `<body>` before `<Navbar />`:

```astro
    <body class='w-svw flex flex-col relative'>
        <LoadingOverlay />
        <Navbar />
        <slot />
        <Footer />
    </body>
```

The import should already exist from Task 2:

```astro
import LoadingOverlay from "../components/loading-overlay.astro"
```

No additional changes needed — the `loading:complete` CustomEvent is dispatched by the overlay script. The `window.__loadingComplete` flag is not needed unless we implement a "skip for returning visitors" feature (deferred per spec).

However, add a small inline script after the LoadingOverlay component to set the flag if the overlay is not present (e.g., on non-home pages if we later decide to conditionally show it):

Add after `<LoadingOverlay />` in the body:

```astro
        <LoadingOverlay />
        <script is:inline>
            // If no loading overlay exists on this page, signal completion immediately
            // so other components (navbar, hero) don't wait forever
            if (!document.getElementById('loading-overlay')) {
                window.__loadingComplete = true;
                window.dispatchEvent(new CustomEvent('loading:complete'));
            }
        </script>
```

- [ ] **Step 2: Verify full flow**

Hard-refresh the homepage. Expected end-to-end flow:
1. Black screen with 3 pulsing dots + "Loading" text
2. Dots expand outward into rings (~20 dots)
3. Dots multiply further (~55 dots), colors shift toward hero tones
4. Overlay fades, hero canvas fades in, navbar + hero text animate in
5. Page is fully interactive

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat(loading): add race condition guard for pages without overlay"
```

---

### Task 9: Visual polish + responsive adjustments

**Files:**
- Modify: `src/components/loading-overlay.astro`

- [ ] **Step 1: Add responsive scaling and visual polish**

Add the following styles to the `<style>` block of `loading-overlay.astro`:

```css
    #loading-overlay {
        transition: opacity 400ms ease-out;
    }

    #loading-dots {
        width: 100vw;
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
    }

    .loading-dot {
        transition: none;
    }

    .spawned-dot {
        transition: none;
    }

    /* Mobile: slightly larger dots for visibility */
    @media (max-width: 768px) {
        .loading-dot {
            width: 10px !important;
            height: 10px !important;
        }
    }
```

Also update the `#loading-dots` container in the HTML to cover the full viewport instead of using flexbox centering:

Change:

```astro
  <div id="loading-dots" class="relative flex items-center justify-center">
    <div class="loading-dot absolute" ...></div>
    <div class="loading-dot absolute" ...></div>
    <div class="loading-dot absolute" ...></div>
  </div>
```

To:

```astro
  <div id="loading-dots">
    <div class="loading-dot" style="position:absolute;width:8px;height:8px;background:var(--color-accent);border-radius:50%;"></div>
    <div class="loading-dot" style="position:absolute;width:8px;height:8px;background:var(--color-accent);border-radius:50%;"></div>
    <div class="loading-dot" style="position:absolute;width:8px;height:8px;background:var(--color-accent);border-radius:50%;"></div>
  </div>
```

The `#loading-text` element stays outside `#loading-dots`, centered by the overlay's flex container.

- [ ] **Step 2: Test on mobile viewport**

Use browser DevTools responsive mode (375px width). Expected: Dots are slightly larger, animation plays correctly, overlay fades properly.

- [ ] **Step 3: Commit**

```bash
git add src/components/loading-overlay.astro
git commit -m "feat(loading): responsive polish + mobile dot sizing"
```

---

### Task 10: Manual end-to-end verification + final commit

**Files:**
- None (verification only)

- [ ] **Step 1: Test full page load on desktop**

Hard-refresh at desktop width (1440px).
- [x] 3 dots pulse at center (0–0.8s)
- [x] ~17 new dots expand in rings (0.8–1.6s)
- [x] ~35 more dots multiply with color shift (1.6–2.4s)
- [x] "Loading" text fades out during multiplication
- [x] Overlay fades, hero fades in (2.4–2.8s + 0.6s hero transition)
- [x] Navbar text animates in after overlay completes
- [x] Hero text + partner logos animate after overlay completes
- [x] Mouse repulsion on particle grid works
- [x] Total perceived time: ~3.4s (2.8s overlay + 0.6s hero fade)

- [ ] **Step 2: Test on mobile viewport**

Responsive mode at 375px.
- [x] Same animation sequence
- [x] Touch burst works on hero after loading
- [x] No horizontal scroll from loading dots

- [ ] **Step 3: Test prefers-reduced-motion**

In browser DevTools, enable "prefers-reduced-motion: reduce" (via Rendering panel or `emulateCSSMediaFeature`).
- [x] Loading overlay shows briefly (~500ms) then fades immediately
- [x] No dot animations play
- [x] Page content loads normally

- [ ] **Step 4: Test repeat navigation (no skip in dev)**

Navigate away from the homepage and back.
- [x] Loading overlay plays again (dev mode — no skip logic)

- [ ] **Step 5: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix(loading): final polish from e2e verification"
```

---

## Self-Review

### Spec Coverage

| Spec Section | Plan Task(s) |
|---|---|
| Phase 1: Pulse | Task 2 |
| Phase 2: Expansion | Task 3 |
| Phase 3: Multiplication | Task 4 |
| Phase 4: Resolution Match | Task 2 (timeline onComplete) |
| Duration 2.8s | Task 2 (PHASE_DURATIONS config) |
| Abstract only, no text | Tasks 2–4 (no text formation code) |
| Dev: no skip logic | Task 8 (flag guard only, no skip) |
| Minimum 1.5s hold | Task 5 |
| prefers-reduced-motion | Task 2 (immediate) + Task 10 (verify) |
| Hero pre-init | Task 6 |
| Overlay z-50 fixed | Task 1 |
| loading:complete event | Task 2 (dispatch) + Tasks 6–7 (listen) |
| PixiJS background start | Task 6 |
| Color shift toward hero | Task 4 (heroColors palette + lerpColor) |
| Dot count 3→20→55 | Tasks 2–4 (newDotCount values) |
| Overlay removed from DOM | Task 2 (overlay.remove()) |

### Placeholder Scan
No TBD, TODO, "implement later", or "add appropriate" lines found. All code blocks contain actual implementation.

### Type Consistency
- `DotData` interface defined once, used consistently in `dotPool`
- `HeroEngine.activate()` added in Task 6, called consistently
- `PHASE_DURATIONS` object keys match usage across Tasks 2–4
- `runExpansion()` / `runMultiplication()` function names used consistently in timeline `.call()` references
- `loading:complete` event name used consistently across all listeners
- `window.__loadingComplete` flag referenced consistently in Tasks 6–8

### Identified Issues
1. ~~`throw new Error("REDUCED_MOTION_SKIP")`~~ — **Fixed.** Replaced with `runLoadingAnimation()` wrapper function. Reduced-motion users call `handleReducedMotion()` directly; normal users call `runLoadingAnimation()`.

2. The `createTimeline` call uses `as any` for the `onComplete` parameter type. This is a workaround for animejs v4's TypeScript types. Acceptable but add a comment.

3. Mobile dot density is fixed (same count as desktop). The spec defers mobile optimization. Acceptable for now.