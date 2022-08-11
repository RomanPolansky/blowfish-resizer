import Blowfish from './Blowfish'

export const defaultParams = {
    x: { value: 0.5, editor: { min: 0.0, max: 1.0, step: 0.001 }, interpolation: Blowfish.Interpolation.Lerp },
    y: { value: 0.5, editor: { min: 0.0, max: 1.0, step: 0.001 }, interpolation: Blowfish.Interpolation.Lerp },
    scale: { value: 1.0, editor: { step: 0.02 }, interpolation: Blowfish.Interpolation.Lerp },
}

export const defaultFuncSetParams = (target: any, params: any, screenSize: { width: number, height: number }) => {
    target.x = params.x * screenSize.width
    target.y = params.y * screenSize.height
    target.scale.set(params.scale)
}

export const defaultParamsPx = {
    x: { value: 100, editor: { min: -1000, max: 1000, step: 1 }, interpolation: Blowfish.Interpolation.Lerp },
    y: { value: 100, editor: { min: -1000, max: 1000, step: 1 }, interpolation: Blowfish.Interpolation.Lerp },
    scale: { value: 1.0, editor: { step: 0.02 }, interpolation: Blowfish.Interpolation.Lerp },
}

export const defaultFuncSetParamsPx = (target: any, params: any) => {
    target.x = params.x
    target.y = params.y
    target.scale.set(params.scale)
}
