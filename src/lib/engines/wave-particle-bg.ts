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
    private boundResizeHandler: (() => void) | null = null

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

        this.boundResizeHandler = () => {
            if (this.resizeTimer !== null) clearTimeout(this.resizeTimer)
            this.resizeTimer = window.setTimeout(() => this.buildGrid(), 250)
        }
        window.addEventListener("resize", this.boundResizeHandler)

        this.isInitialized = true
    }

    public destroy() {
        if (this.resizeTimer !== null) clearTimeout(this.resizeTimer)
        if (this.boundResizeHandler) {
            window.removeEventListener("resize", this.boundResizeHandler)
            this.boundResizeHandler = null
        }
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
