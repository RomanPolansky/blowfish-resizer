export declare abstract class BlowfishCurvePoint {
    readonly aspectRatio: number;
    abstract readonly pointType: 'single' | 'double';
    constructor(aspectRatio: number);
    abstract GetParamPriority(): any;
    abstract GetParamLeft(): any;
    abstract GetParamRight(): any;
}
export declare class BlowfishCurvePointSingle extends BlowfishCurvePoint {
    readonly pointType = "single";
    params: any;
    constructor(aspectRatio: number, params: any);
    GetParamPriority(): any;
    GetParamLeft(): any;
    GetParamRight(): any;
}
export declare class BlowfishCurvePointDouble extends BlowfishCurvePoint {
    readonly pointType = "double";
    priorityLeft: boolean;
    paramsLeft: any;
    paramsRight: any;
    constructor(aspectRatio: number, priorityLeft: boolean, paramsLeft: any, paramsRight: any);
    GetParamPriority(): any;
    GetParamLeft(): any;
    GetParamRight(): any;
}
