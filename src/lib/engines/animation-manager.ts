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

    /**
     * Register a single astro:before-swap cleanup handler (deduplicated).
     * Call once per page — prevents listener accumulation across View Transitions.
     */
    setupSwapCleanup(): void {
        if ((window as any).__astroSwapHandler) return
        const handler = () => this.destroyAll()
        ;(window as any).__astroSwapHandler = handler
        document.addEventListener("astro:before-swap", handler)
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
