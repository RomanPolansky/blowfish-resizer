/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import IBlowfish from '../interfaces/IBlowfish';
import IBlowfishElement from '../interfaces/IBlowfishElement';
import IBlowfishPool from '../interfaces/IBlowfishPool';
import IContentWindow from '../interfaces/IContentWindow';
import BlowfishAspectRatioView from './BlowfishAspectRatioView'
import BlowfishElementSelector from './BlowfishElementSelector'
import BlowfishParamsEditor from './BlowfishParamsEditor'

declare global {
    interface Window extends IContentWindow {}
}

export interface IMixedPool extends IBlowfishPool {
    selectedFish: IBlowfish | null
    selectedElement: IBlowfishElement | null
    aspectRatio: number
    InitMixin: () => void
    ResizeAllFish: () => void
    SetAspectRatio: (aspectRatio: number) => void
    SetSelectFish: (fish: IBlowfish) => void
    SetSelectElement: (element: IBlowfishElement) => void
    EmitUpdate: () => void
}

const BlowfishPoolEditorMixin: any = {
    InitMixin() {
        this.selectedFish = null
        this.selectedElement = null
        this.aspectRatio = 1.0
        this.emit('update')
    },

    ResizeAllFish() {
        const iframe = document.getElementById('game_iframe') as HTMLIFrameElement
        const { width } = iframe.style
        iframe.style.width = '1px'
        iframe.contentWindow?.dispatchEvent(new Event('resize'))
        iframe.style.width = width
        iframe.contentWindow?.dispatchEvent(new Event('resize'))
    },

    SetAspectRatio(aspectRatio: number) {
        this.aspectRatio = aspectRatio
        this.emit('update')
    },

    SetSelectFish(fish: IBlowfish) {
        this.selectedFish = fish
        this.emit('update')
    },

    SetSelectElement(element: IBlowfishElement) {
        this.selectedElement = element
        this.emit('update')
    },

    EmitUpdate() {
        this.emit('update')
    },
};

export default class BlowfishEditor {
    pool!: IMixedPool

    elementSelector!: BlowfishElementSelector
    aspectRatioView!: BlowfishAspectRatioView
    paramsEditor!: BlowfishParamsEditor

    constructor() { this.Connect() }

    Connect() {
        const iframe: HTMLIFrameElement = document.getElementById('game_iframe') as HTMLIFrameElement
        const pool = iframe.contentWindow!.blowfishPool
        if (pool) {
            this.Init(pool)
        } else {
            setTimeout(() => { this.Connect() }, 100)
        }
    }

    Init(pool: IBlowfishPool) {
        Object.assign(pool, BlowfishPoolEditorMixin)
        this.pool = pool as IMixedPool

        this.elementSelector = new BlowfishElementSelector(this.pool, this)
        const listElements = document.getElementById('rightbar__listElements')!
        listElements.appendChild(this.elementSelector.HTMLElement)

        this.aspectRatioView = new BlowfishAspectRatioView(this.pool, this)
        const aspectRatioLine = document.getElementById('aspectRatioLine')!
        aspectRatioLine.appendChild(this.aspectRatioView.HTMLElement)

        this.paramsEditor = new BlowfishParamsEditor(this.pool, this)
        const elementEditor = document.getElementById('editor')!
        elementEditor.appendChild(this.paramsEditor.HTMLElement)

        this.pool.on('update', () => this.elementSelector.Update())
        this.pool.on('update', () => this.aspectRatioView.Update())
        this.pool.on('update', () => this.paramsEditor.Update())

        this.pool.InitMixin()

        this.SetAspectRatio(1.0)
    }

    UpdateChangedParams() {
        this.pool.ResizeAllFish()
    }

    EmitUpdate() {
        this.pool.EmitUpdate()
    }

    SelectFish(fish: IBlowfish) {
        this.pool.SetSelectFish(fish)
    }

    SelectElement(element: IBlowfishElement) {
        this.pool.SetSelectElement(element)
    }

    SetAspectRatio(aspectRatio: number) {
        this.pool.SetAspectRatio(aspectRatio)

        const iframe = document.getElementById('game_iframe')!
        const size = 700
        if (aspectRatio > 1.0) {
            iframe.style.width = `${size}px`
            iframe.style.height = `${Math.floor(size * (1.0 / aspectRatio))}px`
        } else {
            iframe.style.width = `${Math.floor(size * aspectRatio)}px`
            iframe.style.height = `${size}px`
        }
    }

    AddPoint(element: IBlowfishElement, aspectRatio: number, params?: any) {
        element.AddPoint(aspectRatio, params)
        this.pool.EmitUpdate()
    }

    AddPointD(element: IBlowfishElement, aspectRatio: number, priorityLeft: boolean, paramsLeft: any, paramsRight: any) {
        element.AddPointD(aspectRatio, priorityLeft, paramsLeft, paramsRight)
        this.pool.EmitUpdate()
    }

    RemovePoint(element: IBlowfishElement, aspectRatio: number) {
        element.RemovePoint(aspectRatio)
        this.pool.EmitUpdate()
    }

    ExportData() {
        const outObject: any = {}
        const fish = this.pool.selectedFish!
        for (const elementName in fish.mapElements) {
            outObject[elementName] = []
            const element = fish.mapElements[elementName];
            const { points } = element;
            for (let i = 0; i < points.length; i++) {
                if (points[i].pointType === 'single') {
                    outObject[elementName].push({ type: 'single', aspectRatio: points[i].aspectRatio, params: points[i].params });
                }
                if (points[i].pointType === 'double') {
                    outObject[elementName].push({
                        type: 'double',
                        aspectRatio: points[i].aspectRatio,
                        priorityLeft: points[i].priorityLeft,
                        paramsLeft: points[i].paramsLeft,
                        paramsRight: points[i].paramsRight,
                    })
                }
            }
        }

        let outString = JSON.stringify(outObject, (key, value) => {
            if (typeof value === 'number' && !Number.isInteger(value)) return Math.round(value * 10000) / 10000
            return value
        })
        outString = outString.replace(/"([^"]+)":/g, '$1:')
        outString = outString.replace(/"/g, '\'')
        this.CopyStringToClipboard(outString)
    }

    CopyStringToClipboard(str: string) {
        const el = document.createElement('textarea')
        el.value = str
        el.setAttribute('readonly', '')

        el.style.position = 'absolute'
        el.style.left = '-9999px'

        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
    }
}
