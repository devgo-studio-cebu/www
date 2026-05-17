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
