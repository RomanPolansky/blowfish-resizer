import { BlowfishCurvePoint } from './CurvePoints';
export default class BlowfishElement {
    fullParams: any;
    points: BlowfishCurvePoint[];
    private target;
    private fncSetParams;
    constructor(target: any, params: any, fncSetParams: Function);
    Update(aspectRatio: number, screenSize: number, screenScale: number): void;
    AddPoint(aspectRatio: number, paramsIn?: null): void;
    AddPointD(aspectRatio: number, priorityLeft: boolean, paramsLeft: any, paramsRight: any): void;
    RemovePoint(aspectRatio: number): void;
    GetParamsByAspectRatio(aspectRatio: number): any;
    FullParamsToParams(fullParams: any): any;
    TryGetPoint(aspectRatio: number): BlowfishCurvePoint | null;
    GetLeftPoint(aspectRatio: number): BlowfishCurvePoint | null;
    GetRightPoint(aspectRatio: number): BlowfishCurvePoint | null;
    LerpParams(startParams: any, endParams: any, t: number): any;
}
