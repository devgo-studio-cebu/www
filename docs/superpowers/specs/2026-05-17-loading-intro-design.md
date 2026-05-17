# Loading Intro — Design Specification

**Date:** 2026-05-17  
**Project:** DEVGO Studio Website  
**Topic:** Full-page loading intro / splash transition  
**Decision:** Variation C — Particle Density Morph  

---

## 1. Overview

A full-screen loading overlay that plays while the page's hero section assets (images, PixiJS particle grid) initialize. The intro uses an **abstract dot animation** that starts sparse and expands in density, seamlessly transitioning into the existing PixiJS particle grid hero. The core concept: *"Loading is just the hero at low-resolution."*

The loading overlay is built with **animejs v4** and rendered as DOM elements. The PixiJS hero canvas initializes in the background and takes over once loading completes.

---

## 2. Design Decisions

| Decision | Value | Rationale |
|---|---|---|
| **Duration** | 2.8s total | Long enough to feel crafted, short enough to not frustrate |
| **Dot formation** | Abstract only (no text) | Keeps the "low-res hero" concept pure; avoids competing with the hero's large DEVGO wordmark |
| **Skip logic** | **Dev: Disabled** (always plays); Prod: Skip for returning visitors (24h session) | Allows continuous testing in dev; respects repeat visitors in production |
| **Minimum hold** | 1.5s | Prevents flash-of-loading on fast connections |
| **Color palette** | Accent (#5fcba6) → hero image tones | Loading dots blend into the hero's pixel colors during transition |
| **Easing** | `outExpo` for fade, `outCirc` for dot movement | Matches existing navbar/hero animejs patterns |

---

## 3. Animation Timeline

### Phase 1: Pulse (0ms – 800ms)
- Three accent-green dots (#5fcba6) pulse in sequence at dead center of the screen.
- "Loading" text fades in below the dots.
- Dots use `anime.stagger()` with opacity pulse `0.3 → 1`.
- **Minimum hold**: Even if assets load in <1.5s, Phase 1 continues until the 1.5s mark.

### Phase 2: Expansion (800ms – 1600ms)
- Each dot drifts to a coarse grid position (e.g., 6×4 cells spanning the viewport).
- New dots spawn from originals using `anime({ create })`.
- Dot count grows from 3 → ~20.
- Properties animated: `translateX`, `translateY`, `scale: [1, 0.6]`, `opacity` with stagger.

### Phase 3: Multiplication (1600ms – 2400ms)
- Dots continue splitting and drifting toward their final positions in the hero grid.
- Colors interpolate from `#5fcba6` toward the hero image's pixel colors.
- Dot count grows from ~20 → ~50+.
- Dots appear denser but still abstract — no legible text formed.

### Phase 4: Resolution Match (2400ms – 2800ms)
- The loading overlay fades out over 400ms using `outExpo` easing.
- The PixiJS hero canvas (already initialized in the background) becomes visible and takes over interaction.
- The last loading dots dissolve into corresponding positions of the hero particle grid.
- **No hard cut** — the transition feels like a resolution increase.

---

## 4. Visual Styling

| Element | Style |
|---|---|
| Background | `#040906` (matches site bg) |
| Loading dots | `border-radius: 50%`, varying sizes (3–8px), opacity 0.3–1 |
| Dot colors | Start: `#5fcba6` (accent) → Phase 3+: interpolate toward hero pixel colors |
| "Loading" text | `font-size: 10px`, `color: #757575`, `text-transform: uppercase`, `letter-spacing: 4px` |
| Overlay | `position: fixed`, `inset: 0`, `z-index: 50`, `background: #040906` |
| Reduced motion | Skip to Phase 4 (immediate fade if `prefers-reduced-motion: reduce`) |

---

## 5. Architecture & Components

### New Component: `src/components/loading-overlay.astro`
- **Purpose**: Houses the loading animation logic and DOM dot elements.
- **Structure**:
  - Container div: fixed fullscreen, z-index 50, bg #040906
  - Dot container: centered div holding animated dot elements
  - Status text: "Loading" label
- **Script**:
  - `animejs` timeline orchestrating all 4 phases
  - `create` callback for dot multiplication
  - `complete` callback firing a custom event (`loading:complete`) consumed by the hero

### Modified: `src/layouts/BaseLayout.astro`
- Mount `<LoadingOverlay />` as the first child of `<body>`, before `<Navbar>`.
- Add inline script to set `window.__loadingStartTime = performance.now()` for timing coordination.

### Modified: `src/components/landing/hero.astro`
- Split initialization into two phases:
  1. **Pre-init** (during loading): Create PixiJS app, set `canvas.style.opacity = '0'` and `canvas.style.pointerEvents = 'none'`.
  2. **Activate** (on `loading:complete` event): Fade canvas in over 400ms, restore pointer events, start mouse/touch listeners.
- Emit `loading:complete` if overlay already dismissed (race condition guard).

### Coordination Flow

```
BaseLayout mounts
  ↓
LoadingOverlay starts Phase 1 (0ms)
  ↓ (concurrent)
Hero pre-init: PixiJS canvas created, opacity=0, behind overlay
  ↓
Phase 4 (2400ms): Overlay fades out, fires "loading:complete"
  ↓
Hero receives event, fades canvas in, starts interaction
  ↓
Overlay removed from DOM (or display:none)
```

---

## 6. Data Flow & State

- **No global state library needed.** Coordination uses a single `CustomEvent` dispatched on `window`.
- Event name: `loading:complete`
- The hero script listens for this event. If the event already fired before the hero script loads, a `window.__loadingComplete` flag signals the hero to skip its own waiting phase.

---

## 7. Error Handling

| Scenario | Behavior |
|---|---|
| PixiJS init fails | Overlay still completes after 2.8s. Hero canvas stays hidden; fallback static image shown via CSS |
| Hero image load fails | Overlay completes. PixiJS grid builds with whatever image loaded. If no image, grid renders with default gray dots |
| Script error in loading overlay | Catch in `try/catch` around anime timeline. Log to console, force overlay removal after 3s timeout |
| `prefers-reduced-motion: reduce` | Skip to immediate fade. Overlay shows for 500ms then fades to hero |

---

## 8. Performance Considerations

- **DOM node count**: Maximum ~50–60 dot elements during Phase 3. Well within performant limits for animejs v4.
- **Will-change**: Apply `will-change: transform, opacity` to dot elements in CSS.
- **PixiJS pre-init**: Start PixiJS app during Phase 1 so the grid is ready before Phase 4.
- **Asset loading**: Hero image and partner logos load in parallel; loading overlay duration is independent of individual image load times (capped by 1.5s minimum + 1.3s animation = 2.8s).
- **Cleanup**: Remove overlay from DOM after Phase 4 (not just `opacity: 0`) to free memory.

---

## 9. Dependencies

- **animejs** v4.3.6 (already in `package.json`)
- **pixi.js** v8.17.1 (already in `package.json`)
- No additional packages required.

---

## 10. Testing Plan

| Test | Expected Result |
|---|---|
| Hard refresh | Loading overlay plays full 2.8s sequence |
| Fast connection (cached) | Still shows minimum 1.5s, completes 2.8s |
| Slow connection (throttled) | Overlay may extend if assets not ready; phases wait on `Promise.all([assets, minimumDelay])` |
| `prefers-reduced-motion: reduce` | Overlay shows ~500ms then fades |
| Mobile | Touch events work after transition. Dots scale proportionally. |
| Prod repeat visit | Overlay skipped entirely (or shows ~200ms flash) — implementation detail deferred to plan |
| Dev environment | Overlay **always plays** regardless of repeat visits |

---

## 11. Accessibility

- Respects `prefers-reduced-motion: reduce` — skips to minimal fade.
- Overlay does not trap keyboard focus (no interactive elements inside it).
- Screen readers: `aria-hidden="true"` on the overlay container after Phase 4.

---

## 12. Open / Deferred Items

1. **Prod skip logic**: How to detect returning visitors? Options: `sessionStorage` flag, `localStorage` timestamp, or cookie. Defer implementation detail to the implementation plan.
2. **Hero pixel color sampling**: In Phase 3, dots interpolate toward hero pixel colors. Exact sampling method (offscreen canvas + `getImageData` vs. precomputed palette) deferred to plan.
3. **Mobile dot density**: Should mobile show fewer dots (performance)? Defer to plan.
4. **Return visitor threshold**: Is 24h right? Or one session? Or first visit only? Defer to plan.

---

## 13. Approval

**Designer:** System (brainstorming skill)  
**Approver:** @adrianbonpin  
**Status:** ✅ Approved 2026-05-17
