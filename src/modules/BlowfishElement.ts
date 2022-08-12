/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import IBlowfishElement from '../interfaces/IBlowfishElement'
import { BlowfishCurvePoint, BlowfishCurvePointDouble, BlowfishCurvePointSingle } from './CurvePoints'

export default class BlowfishElement implements IBlowfishElement {
    public fullParams: any
    public points: BlowfishCurvePoint[] = []

    private target: any
    private fncSetParams: Function

    constructor(target: any, params: any, fncSetParams: Function) {
        this.target = target
        this.fullParams = params
        this.fncSetParams = fncSetParams
    }

    private Update(aspectRatio: number, screenSize: number, screenScale: number) {
        const params = this.GetParamsByAspectRatio(aspectRatio)
        this.fncSetParams(this.target, params, screenSize, screenScale)
    }

    public AddPoint(aspectRatio: number, paramsIn = null) {
        if (paramsIn == null) {
            const params = this.GetParamsByAspectRatio(aspectRatio)
            const paramsCopy = JSON.parse(JSON.stringify(params))
            this.points.push(new BlowfishCurvePointSingle(aspectRatio, paramsCopy))
        } else {
            this.points.push(new BlowfishCurvePointSingle(aspectRatio, paramsIn))
        }
        this.points.sort((a, b) => ((a.aspectRatio < b.aspectRatio) ? -1 : 1))
    }

    public AddPointD(aspectRatio: number, priorityLeft: boolean, paramsLeft: any, paramsRight: any) {
        const paramsLeftCopy = JSON.parse(JSON.stringify(paramsLeft))
        const paramsRightCopy = JSON.parse(JSON.stringify(paramsRight))
        this.points.push(new BlowfishCurvePointDouble(aspectRatio, priorityLeft, paramsLeftCopy, paramsRightCopy))
        this.points.sort((a, b) => ((a.aspectRatio < b.aspectRatio) ? -1 : 1))
    }

    public RemovePoint(aspectRatio: number) {
        const point = this.TryGetPoint(aspectRatio)
        if (point != null) {
            const i = this.points.indexOf(point)
            this.points.splice(i, 1)
        }
    }

    public GetParamsByAspectRatio(aspectRatio: number) {
        const point = this.TryGetPoint(aspectRatio)
        if (point != null) return point.GetParamPriority()

        let params = null
        const leftPoint = this.GetLeftPoint(aspectRatio)
        const rightPoint = this.GetRightPoint(aspectRatio)

        if (leftPoint == null) {
            if (rightPoint == null) {
                params = this.FullParamsToParams(this.fullParams)
            } else {
                params = rightPoint.GetParamLeft()
            }
        } else
        if (rightPoint == null) {
            params = leftPoint.GetParamRight()
        } else {
            let t = (rightPoint.aspectRatio - aspectRatio) / (rightPoint.aspectRatio - leftPoint.aspectRatio)
            t = Math.min(1.0, Math.max(0.0, 1.0 - t))
            params = this.LerpParams(leftPoint.GetParamRight(), rightPoint.GetParamLeft(), t)
        }
        return params;
    }

    private FullParamsToParams(fullParams: any) {
        const params: any = {}
        for (const paramName in fullParams) {
            params[paramName] = fullParams[paramName].value
        }
        return params
    }

    public TryGetPoint(aspectRatio: number) {
        for (let i = 0; i < this.points.length; i++) {
            if (Math.abs(aspectRatio - this.points[i].aspectRatio) < 0.005) {
                return this.points[i];
            }
        }
        return null;
    }

    private GetLeftPoint(aspectRatio: number) {
        let point = null;
        for (let i = 0; i < this.points.length; i++) {
            if (this.points[i].aspectRatio < aspectRatio) {
                point = this.points[i];
            }
        }
        return point;
    }

    private GetRightPoint(aspectRatio: number) {
        for (let i = 0; i < this.points.length; i++) {
            if (this.points[i].aspectRatio > aspectRatio) {
                return this.points[i];
            }
        }
        return null;
    }

    private LerpParams(startParams: any, endParams: any, t: number) {
        const params: any = {}
        for (const paramName in startParams) {
            const fnInterpolation = this.fullParams[paramName].interpolation
            params[paramName] = fnInterpolation(startParams[paramName], endParams[paramName], t)
        }
        return params
    }
}
