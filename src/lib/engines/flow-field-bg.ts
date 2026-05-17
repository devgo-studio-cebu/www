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
