/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import BlowfishElement from './BlowfishElement'
import BlowfishPool from './BlowfishPool'

interface IResolutionElement { width: number, height: number, aspectRatio?: number }

class Blowfish {
    public name: string
    public defaultParams: any
    public defaultFuncSetParams: any
    public resolutions: IResolutionElement[] = []
    public mapElements: any = {}
    public prevScreenSize = { width: 1, height: 1 }

    constructor(
        name: string,
        elements: any,
        curvesConfig: any,
        defaultParams: any,
        defaultFuncSetParams: any,
        resolutions: IResolutionElement[] = [
            { width: 20.0, height: 9.0 },
            { width: 19.5, height: 9.0 },
            { width: 16.0, height: 9.0 },
            { width: 8.0, height: 5.0 },
            { width: 4.0, height: 3.0 },
            { width: 1.0, height: 1.0 },
            { width: 3.0, height: 4.0 },
            { width: 5.0, height: 8.0 },
            { width: 9.0, height: 16.0 },
            { width: 9.0, height: 19.5 },
            { width: 9.0, height: 20.0 },
        ],
    ) {
        this.name = name
        this.defaultParams = defaultParams
        this.defaultFuncSetParams = defaultFuncSetParams

        this.SetResolutions(resolutions)
        this.SetElements(elements, curvesConfig ?? {})

        BlowfishPool.Instance.Add(this)
    }

    get MaxAspectRatio() {
        return this.resolutions[this.resolutions.length - 1].aspectRatio
    }

    get MinAspectRatio() {
        return this.resolutions[0].aspectRatio
    }

    SetResolutions(resolutions: IResolutionElement[]) {
        this.resolutions = resolutions
        for (let i = 0; i < this.resolutions.length; i++) {
            this.resolutions[i].aspectRatio = this.resolutions[i].width / this.resolutions[i].height
        }
        this.resolutions.sort((a, b) => ((a.aspectRatio! < b.aspectRatio!) ? -1 : 1))
    }

    SetElements(elements: any, curvesConfig: any) {
        this.mapElements = {}

        for (const elementName in elements) {
            const element = elements[elementName]
            if (element.target != null) {
                this.mapElements[elementName] = new BlowfishElement(
                    element.target,
                    element.params ?? this.defaultParams,
                    element.fncSetParams ?? this.defaultFuncSetParams,
                )
            }
        }

        for (const elementName in this.mapElements) {
            const pointsConfig = curvesConfig[elementName]
            if (pointsConfig != null) {
                const element = this.mapElements[elementName]
                for (let i = 0; i < pointsConfig.length; i++) {
                    const params = element.FullParamsToParams(element.fullParams)
                    if (pointsConfig[i].type === 'single') {
                        const configParams = this.FixParams(params, pointsConfig[i].params)
                        element.AddPoint(pointsConfig[i].aspectRatio, configParams)
                    } else {
                        const configParamsL = this.FixParams(params, pointsConfig[i].paramsLeft)
                        const configParamsR = this.FixParams(params, pointsConfig[i].paramsRight)
                        element.AddPointD(pointsConfig[i].aspectRatio, pointsConfig[i].priorityLeft, configParamsL, configParamsR)
                    }
                }
            }
        }

        this.CreateDefaultCurvePointsForElements()
    }

    FixParams(defParams: any, fixParams: any) {
        const params: any = {}
        if (fixParams != null) {
            for (const paramName in defParams) {
                params[paramName] = (fixParams[paramName] != null) ? fixParams[paramName] : defParams[paramName]
            }
        }
        return params
    }

    CreateDefaultCurvePointsForElements() {
        for (const elementName in this.mapElements) {
            const element = this.mapElements[elementName]
            if (element.points.length === 0) {
                element.AddPoint(this.MinAspectRatio)
                element.AddPoint(this.MaxAspectRatio)
            }
        }
    }

    Update(width = this.prevScreenSize.width, height = this.prevScreenSize.height) {
        this.prevScreenSize.width = width
        this.prevScreenSize.height = height

        const screenSize = { width, height }
        const aspectRatio = width / height
        const screenScale = Math.min(width / 960.0, height / 960.0)

        for (const elementName in this.mapElements) {
            const element = this.mapElements[elementName]
            element.Update(aspectRatio, screenSize, screenScale)
        }
    }
}

namespace Blowfish {
    export const Interpolation = {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Left: (leftValue: number, rightValue: number, t: number) => (leftValue),
        Lerp: (leftValue: number, rightValue: number, t: number) => (leftValue * (1 - t) + rightValue * t),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Right: (leftValue: number, rightValue: number, t: number) => (rightValue),
    }
}

export default Blowfish
