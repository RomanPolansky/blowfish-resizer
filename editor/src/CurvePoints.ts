export abstract class BlowfishCurvePoint {
    public readonly aspectRatio: number

    public readonly abstract pointType: 'single' | 'double'

    constructor(aspectRatio: number) {
        this.aspectRatio = aspectRatio
    }

    abstract GetParamPriority(): any
    abstract GetParamLeft(): any
    abstract GetParamRight(): any
}

export class BlowfishCurvePointSingle extends BlowfishCurvePoint {
    public readonly pointType = 'single'
    public params: any
    constructor(aspectRatio: number, params: any) {
        super(aspectRatio)
        this.params = params
    }

    GetParamPriority() { return this.params }
    GetParamLeft() { return this.params }
    GetParamRight() { return this.params }
}

export class BlowfishCurvePointDouble extends BlowfishCurvePoint {
    public readonly pointType = 'double'
    public priorityLeft: boolean

    public paramsLeft: any
    public paramsRight: any

    constructor(aspectRatio: number, priorityLeft: boolean, paramsLeft: any, paramsRight: any) {
        super(aspectRatio)
        this.priorityLeft = priorityLeft
        this.paramsLeft = paramsLeft
        this.paramsRight = paramsRight
    }

    GetParamPriority() { return this.priorityLeft ? this.paramsLeft : this.paramsRight }
    GetParamLeft() { return this.paramsLeft }
    GetParamRight() { return this.paramsRight }
}
