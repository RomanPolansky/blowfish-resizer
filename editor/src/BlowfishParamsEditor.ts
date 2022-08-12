/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import { EventEmitter } from '@pixi/utils'
import * as Tweakpane from 'tweakpane'
import BlowfishEditor, { IMixedPool } from './BlowfishEditor'
import { BlowfishCurvePointDouble, BlowfishCurvePointSingle } from './CurvePoints'

declare global {
    interface Window {
        blowfishClipboard: any
    }
}

function compareKeys(a: any, b: any) {
    const aKeys = Object.keys(a).sort()
    const bKeys = Object.keys(b).sort()
    return JSON.stringify(aKeys) === JSON.stringify(bKeys)
}

export default class BlowfishParamsEditor extends EventEmitter {
    private pane: any = new Tweakpane.Pane()
    private pool: IMixedPool
    private controller: BlowfishEditor

    constructor(pool: IMixedPool, controller: BlowfishEditor) {
        super()
        this.pool = pool
        this.controller = controller
    }

    get HTMLElement() {
        return this.pane.element
    }

    FixStyle(input: any) {
        input.controller_.view.valueElement.style.width = '70%'
        input.controller_.view.labelElement.style.width = '30%'
    }

    Update() {
        // remove prev
        for (let i = this.pane.children.length - 1; i >= 0; i--) {
            const child = this.pane.children[i]
            this.pane.remove(child)
            child.dispose()
        }

        const element = this.pool.selectedElement
        const { aspectRatio } = this.pool

        if (element != null) {
            const btnExport = this.pane.addButton({ label: 'Export', title: 'Export' })
            btnExport.on('click', () => { this.controller.ExportData() })
            this.FixStyle(btnExport)

            this.pane.addSeparator()
            // separator.controller_.view.element.style.height = "20px"

            const btnAddKey = this.pane.addButton({ title: 'Add Key' });
            const btnRemoveKey = this.pane.addButton({ title: 'Remove Key' });
            const typeSelector = this.pane.addBlade({
                value: 0,
                view: 'list',
                label: 'type',
                options: [
                    { text: 'Single', value: 0 }, { text: 'Double (Priority Left)', value: 1 }, { text: 'Double (Priority Right)', value: 2 },
                ],
            })
            this.FixStyle(typeSelector)

            const point = element.TryGetPoint(aspectRatio);
            if (point != null) {
                btnAddKey.disabled = true
                btnRemoveKey.on('click', () => { this.controller.RemovePoint(element, aspectRatio) })

                if (point.pointType === 'single') {
                    const singlePoint = point as BlowfishCurvePointSingle
                    typeSelector.value = 0

                    const { fullParams } = element
                    const { params } = singlePoint

                    const folder = this.pane.addFolder({ title: 'Single', expanded: true })

                    for (const paramName in fullParams) {
                        const paramEditor = fullParams[paramName].editor
                        const input = folder.addInput(params, paramName, paramEditor)
                        this.FixStyle(input)
                        input.on('change', () => { this.controller.UpdateChangedParams() })
                    }

                    folder.addSeparator()
                    const btnCopy = folder.addButton({ label: 'Copy', title: 'Copy' })
                    this.FixStyle(btnCopy)

                    btnCopy.on('click', () => { window.blowfishClipboard = { ...singlePoint.params } })
                    const btnPaste = folder.addButton({ label: 'Paste', title: 'Paste' })
                    this.FixStyle(btnPaste)

                    btnPaste.on('click', () => {
                        if (compareKeys(singlePoint.params, window.blowfishClipboard)) {
                            singlePoint.params = window.blowfishClipboard
                            this.controller.UpdateChangedParams()
                            this.controller.EmitUpdate()
                        }
                    })
                }

                if (point.pointType === 'double') {
                    const doublePoint = point as BlowfishCurvePointDouble
                    typeSelector.value = doublePoint.priorityLeft ? 1 : 2;

                    const { fullParams } = element;
                    const paramsLeft = point.GetParamLeft();
                    const paramsRght = point.GetParamRight();

                    const folderL = this.pane.addFolder({ title: 'Left', expanded: true })
                    const folderR = this.pane.addFolder({ title: 'Right', expanded: true })

                    for (const paramName in fullParams) {
                        const paramEditor = fullParams[paramName].editor

                        const inputL = folderL.addInput(paramsLeft, paramName, paramEditor);
                        this.FixStyle(inputL)

                        const inputR = folderR.addInput(paramsRght, paramName, paramEditor)
                        this.FixStyle(inputR)

                        inputL.on('change', () => { this.controller.UpdateChangedParams() })
                        inputR.on('change', () => { this.controller.UpdateChangedParams() })
                    }

                    folderL.addSeparator()
                    const btnCopyL = folderL.addButton({ label: 'Copy', title: 'Copy' })
                    this.FixStyle(btnCopyL)

                    btnCopyL.on('click', () => { window.blowfishClipboard = { ...point.GetParamLeft() } })
                    const btnPasteL = folderL.addButton({ label: 'Paste', title: 'Paste' })
                    this.FixStyle(btnPasteL)

                    btnPasteL.on('click', () => {
                        if (compareKeys(doublePoint.paramsLeft, window.blowfishClipboard)) {
                            doublePoint.paramsLeft = window.blowfishClipboard
                            this.controller.UpdateChangedParams()
                            this.controller.EmitUpdate()
                        }
                    })

                    folderR.addSeparator()
                    const btnCopyR = folderR.addButton({ label: 'Copy', title: 'Copy' })
                    this.FixStyle(btnCopyR)

                    btnCopyR.on('click', () => { window.blowfishClipboard = { ...point.GetParamRight() } })
                    const btnPasteR = folderR.addButton({ label: 'Paste', title: 'Paste' })
                    this.FixStyle(btnPasteR)

                    btnPasteR.on('click', () => {
                        if (compareKeys(doublePoint.paramsRight, window.blowfishClipboard)) {
                            doublePoint.paramsRight = window.blowfishClipboard
                            this.controller.UpdateChangedParams()
                            this.controller.EmitUpdate()
                        }
                    })
                }

                typeSelector.on('change', (evt: any) => {
                    setTimeout(() => {
                        if (evt.value === 0) {
                            if (point.pointType === 'double') {
                                const params0 = point.GetParamPriority()
                                this.controller.RemovePoint(element, aspectRatio)
                                this.controller.AddPoint(element, aspectRatio, params0)
                            }
                        } else
                        if (evt.value === 1) {
                            if (point.pointType === 'double') {
                                (point as BlowfishCurvePointDouble).priorityLeft = true
                                this.controller.UpdateChangedParams()
                                this.controller.EmitUpdate()
                            } else {
                                const params1 = point.GetParamPriority()
                                this.controller.RemovePoint(element, aspectRatio)
                                this.controller.AddPointD(element, aspectRatio, true, params1, params1)
                            }
                        } else
                        if (evt.value === 2) {
                            if (point.pointType === 'double') {
                                (point as BlowfishCurvePointDouble).priorityLeft = false
                                this.controller.UpdateChangedParams()
                                this.controller.EmitUpdate()
                            } else {
                                const params2 = point.GetParamPriority()
                                this.controller.RemovePoint(element, aspectRatio)
                                this.controller.AddPointD(element, aspectRatio, false, params2, params2)
                            }
                        }
                    }, 1)
                })
            } else {
                btnRemoveKey.disabled = true
                btnAddKey.on('click', () => { this.controller.AddPoint(element, aspectRatio) })
                typeSelector.disabled = true

                const folder = this.pane.addFolder({ title: '', expanded: true })
                const params = element.GetParamsByAspectRatio(aspectRatio)
                const { fullParams } = element

                for (const paramName in fullParams) {
                    const paramEditor = fullParams[paramName].editor

                    const input = folder.addInput(params, paramName, paramEditor)
                    input.disabled = true
                    this.FixStyle(input)
                }
            }
        }
    }
}
