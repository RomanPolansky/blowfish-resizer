/* eslint-disable import/no-extraneous-dependencies */
import { Renderer, extensions as Extensions, BatchRenderer } from '@pixi/core'
import { Container } from '@pixi/display'
import { Graphics } from '@pixi/graphics'
import { InteractionManager } from '@pixi/interaction'
import { Point, Rectangle } from '@pixi/math'
import { Text } from '@pixi/text'
import { EventEmitter, string2hex } from '@pixi/utils'
import Blowfish from './Blowfish'
import BlowfishEditor, { IMixedPool } from './BlowfishEditor'
import { BlowfishCurvePointDouble } from './CurvePoints'

const padding = { horizontal: 16.0, vertical: 16.0 }
const colorBackground = string2hex('#222222')
const colorCurve = string2hex('#00ff00')
const colorSeparators = string2hex('#888888')
const colorIndicator = string2hex('#00ffff')

class Application {
    view: HTMLCanvasElement
    renderer: Renderer
    stage = new Container()

    constructor() {
        this.view = document.createElement('canvas')
        Extensions.add(BatchRenderer, InteractionManager)
        this.renderer = new Renderer({
            width: 16,
            height: 16,
            view: this.view,
            antialias: true,
            backgroundColor: colorBackground,
        })
    }

    render() {
        this.renderer.render(this.stage)
    }
}

export default class BlowfishAspectRatioView extends EventEmitter {
    private pool: IMixedPool
    private controller: BlowfishEditor
    private prevSelectedFish: Blowfish | null

    private app = new Application()

    private gSeparators = new Graphics()
    private gCurve = new Graphics()
    private gIndicator = new Graphics()

    private resolutionLabels: Container[] = []

    private isDragPointer = false
    private isSnap = false

    private prevParent: any

    private resizeObserver?: ResizeObserver

    constructor(pool: IMixedPool, controller: BlowfishEditor) {
        super()
        this.pool = pool
        this.controller = controller
        this.prevSelectedFish = null

        this.app.view.style.position = 'absolute'

        this.gSeparators.interactive = true
        this.app.stage.addChild(this.gSeparators, this.gCurve, this.gIndicator)

        this.gSeparators.on('pointerdown', (evt) => {
            this.isDragPointer = true
            this.SetAspectRatioByPointerPosition(evt.data.global)
        })

        this.gSeparators.on('pointerup', () => { this.isDragPointer = false })
        this.gSeparators.on('pointerupoutside', () => { this.isDragPointer = false })

        this.gSeparators.on('pointermove', (evt) => {
            if (this.isDragPointer) this.SetAspectRatioByPointerPosition(evt.data.global)
        })

        document.addEventListener('keydown', (evt) => {
            if (evt.code === 'ShiftLeft') {
                this.isSnap = true
            }
        })

        document.addEventListener('keyup', (evt) => {
            if (evt.code === 'ShiftLeft') {
                this.isSnap = false
            }
        })

        // resize and change parent
        const intersectionObserver = new IntersectionObserver(() => {
            this.ChangeParentHandler(this.app.view.parentNode)
        })
        intersectionObserver.observe(this.app.view)

        this.prevParent = this.app.view.parentNode
    }

    get HTMLElement() {
        return this.app.view
    }

    Update() {
        const fish = this.pool.selectedFish;
        if (this.prevSelectedFish !== fish) {
            this.prevSelectedFish = fish
            this.RecreateLabels()
        }

        this.DrawSeparators()
        this.MoveLabels()
        this.DrawCurve()
        this.DrawIndicator()
        this.app.render()
    }

    SetAspectRatioByPointerPosition(position: Point) {
        const fish = this.pool.selectedFish
        if (fish != null) {
            position.x = Math.max(Math.min(position.x, this.app.renderer.width), 0)
            let aspectRatio = this.GetAspectRatioByX(position.x)
            if (this.isSnap) {
                aspectRatio = this.GetSnapAspectRatio(aspectRatio)!
            }
            this.controller.SetAspectRatio(aspectRatio)
        }
    }

    RecreateLabels() {
        // remove prev labels
        for (let i = this.resolutionLabels.length - 1; i >= 0; i--) {
            this.resolutionLabels[i].destroy();
        }

        // create new labels
        const fish = this.pool.selectedFish
        this.resolutionLabels = []
        if (fish != null) {
            const { resolutions } = fish
            for (let i = 0; i < resolutions.length; i++) {
                this.resolutionLabels[i] = new Container()
                this.app.stage.addChild(this.resolutionLabels[i])

                const bg = new Graphics()
                bg.beginFill(0x111111).drawRect(0, 0, 40, 12).endFill()
                this.resolutionLabels[i].addChild(bg)

                const text = new Text(`${resolutions[i].width}x${resolutions[i].height}`, { fontFamily: 'Open Sans', fontSize: 12, fill: 'white' })
                text.anchor.set(0.5, 0)
                text.position.set(20, -1)
                this.resolutionLabels[i].addChild(text)
            }
        }
    }

    DrawSeparators() {
        const fish = this.pool.selectedFish;
        this.gSeparators.clear();
        if (fish != null) {
            const { resolutions } = fish;
            for (let i = 0; i < resolutions.length; i++) {
                const x = this.GetXByAspectRatio(resolutions[i].aspectRatio!);
                this.gSeparators.lineStyle(1, colorSeparators, 1).moveTo(x, 0).lineTo(x, this.app.renderer.height).endFill();
            }
        }
    }

    MoveLabels() {
        const fish = this.pool.selectedFish
        if (fish != null) {
            const { resolutions } = fish
            for (let i = 0; i < resolutions.length; i++) {
                this.resolutionLabels[i].x = this.GetXByAspectRatio(resolutions[i].aspectRatio!)
            }
        }
    }

    DrawCurve() {
        const element = this.pool.selectedElement
        this.gCurve.clear()
        if (element != null) {
            const { points } = element
            this.gCurve.lineStyle(0)
            for (let i = 0; i < points.length; i++) {
                const ar1 = points[i].aspectRatio
                const x1 = this.GetXByAspectRatio(ar1)
                let y1 = this.GetYByAspectRatio(ar1)
                if (points[i].pointType === 'double') {
                    this.gCurve.beginFill(colorCurve).drawRect(x1 - 2, y1 - 2 - 5, 4, 4).endFill()
                    this.gCurve.beginFill(colorCurve).drawRect(x1 - 2, y1 - 2 + 5, 4, 4).endFill()
                    y1 += (points[i] as BlowfishCurvePointDouble).priorityLeft ? 5 : -5
                } else {
                    this.gCurve.beginFill(colorCurve).drawRect(x1 - 2, y1 - 2, 4, 4).endFill()
                }

                if (i + 1 < points.length) {
                    const ar2 = points[i + 1].aspectRatio
                    const x2 = this.GetXByAspectRatio(ar2)
                    let y2 = this.GetYByAspectRatio(ar2)
                    if (points[i + 1].pointType === 'double') y2 += (points[i + 1] as BlowfishCurvePointDouble).priorityLeft ? -5 : 5
                    this.gCurve.lineStyle(1, colorCurve, 1).moveTo(x1, y1).lineTo(x2, y2).endFill()
                }
            }
        }
    }

    DrawIndicator() {
        const fish = this.pool.selectedFish
        this.gIndicator.clear()
        if (fish != null) {
            const x = this.GetXByAspectRatio(this.pool.aspectRatio)
            this.gSeparators.lineStyle(1, colorIndicator, 1).moveTo(x, 0).lineTo(x, this.app.renderer.height).endFill()
        }
    }

    GetSnapAspectRatio(aspectRatio: number) {
        const fish = this.pool.selectedFish;
        if (fish != null) {
            const { resolutions } = fish
            let minDistance = Math.abs(resolutions[0].aspectRatio! - aspectRatio);
            let out = resolutions[0].aspectRatio;

            for (let i = 1; i < resolutions.length; i++) {
                const distance = Math.abs(resolutions[i].aspectRatio! - aspectRatio);
                if (distance < minDistance) {
                    out = resolutions[i].aspectRatio;
                    minDistance = distance;
                }
            }

            const element = this.pool.selectedElement;
            if (element != null) {
                const { points } = element;
                for (let i = 0; i < points.length; i++) {
                    const distance = Math.abs(points[i].aspectRatio - aspectRatio);
                    if (distance < minDistance) {
                        out = points[i].aspectRatio;
                        minDistance = distance;
                    }
                }
            }

            return out;
        }
        return aspectRatio;
    }

    GetYByAspectRatio(aspectRatio: number) {
        const fish = this.pool.selectedFish!
        const minValue = fish.MinAspectRatio!
        const maxValue = fish.MaxAspectRatio!
        const t = (aspectRatio - minValue) / (maxValue - minValue)
        return this.app.renderer.height - t * (this.app.renderer.height - padding.vertical * 2.0) - padding.vertical
    }

    GetXByAspectRatio(aspectRatio: number) {
        const fish = this.pool.selectedFish!
        const minValue = fish.MinAspectRatio!
        const maxValue = fish.MaxAspectRatio!
        const t = (aspectRatio - minValue) / (maxValue - minValue)
        return padding.horizontal + t * (this.app.renderer.width - padding.horizontal * 2.0)
    }

    GetAspectRatioByX(x: number) {
        const fish = this.pool.selectedFish!
        const minValue = fish.MinAspectRatio!
        const maxValue = fish.MaxAspectRatio!
        let t = (x - padding.horizontal) / (this.app.renderer.width - padding.horizontal * 2.0)
        t = minValue + t * (maxValue - minValue)
        return t
    }

    // change parent
    ChangeParentHandler(parent: any) {
        if (this.resizeObserver === undefined) {
            this.resizeObserver = new ResizeObserver((evt) => {
                const { width, height } = evt[0].contentRect
                this.ChangeSizeHandler(width, height)
            })
        } else {
            this.resizeObserver.unobserve(this.prevParent)
        }
        this.prevParent = parent
        this.resizeObserver.observe(parent)
        this.ChangeSizeHandler(parent.clientWidth, parent.clientHeight)
    }

    // resize parent
    ChangeSizeHandler(width: number, height: number) {
        if (this.app.renderer.view.style.width !== width.toString() || this.app.renderer.view.style.height !== height.toString()) {
            this.app.renderer.resize(width, height)
            this.gSeparators.hitArea = new Rectangle(0, 0, width, height)
            this.Update()
        }
    }
}
