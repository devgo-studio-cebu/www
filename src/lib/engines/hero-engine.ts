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
