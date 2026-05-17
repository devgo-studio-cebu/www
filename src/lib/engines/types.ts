import type * as PIXI from "pixi.js"

export interface PixiEngine {
    init(): Promise<void>
    destroy(): void
}

export interface EngineConfig {
    canvas: HTMLCanvasElement
    wrapper: HTMLElement
}
