/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { EventEmitter } from '@pixi/utils'
import * as Tweakpane from 'tweakpane'
// eslint-disable-next-line import/no-cycle
import BlowfishEditor, { IMixedPool } from './BlowfishEditor'

export default class BlowfishElementSelector extends EventEmitter {
    public pool
    public controller
    public prevFishsCount = 0

    private pane: any = new Tweakpane.Pane()

    constructor(pool: IMixedPool, controller: BlowfishEditor) {
        super()
        this.pool = pool
        this.controller = controller
    }

    get HTMLElement() {
        return this.pane.element
    }

    Update() {
        const { fishs } = this.pool
        if (this.prevFishsCount !== fishs.length) {
            this.prevFishsCount = fishs.length
            this.UpdateTabs()
        }
        this.UpdateElements()
    }

    UpdateElements() {
        const selectElement = this.pool.selectedElement
        const tab = this.pane.children[0]
        for (let i = 0; i < tab.pages.length; i++) {
            const btns = tab.pages[i].children
            for (let j = 0; j < btns.length; j++) {
                const element = btns[j].dataElement
                btns[j].disabled = (element === selectElement)
            }
        }
    }

    UpdateTabs() {
        const { fishs } = this.pool

        const pages = [];
        for (let i = 0; i < fishs.length; i++) {
            pages.push({ title: fishs[i].name })
        }
        if (pages.length !== 0) {
            const tab = this.pane.addTab({ pages })
            for (let i = 0; i < fishs.length; i++) {
                for (const elementName in fishs[i].mapElements) {
                    const fish = fishs[i]
                    const element = fish.mapElements[elementName]
                    const btn = tab.pages[i].addButton({ title: elementName })
                    btn.dataElement = element
                    btn.on('click', () => {
                        this.controller.SelectFish(fish)
                        this.controller.SelectElement(element)
                    })
                }
            }
        }
    }
}
