import { BlowfishCurvePoint } from '../modules/CurvePoints'

export default interface IBlowfishElement {
    fullParams: any
    points: BlowfishCurvePoint[]
    TryGetPoint: (aspectRatio: number) => BlowfishCurvePoint | null
    AddPoint: (aspectRatio: number, paramsIn?: any) => void
    AddPointD: (aspectRatio: number, priorityLeft: boolean, paramsLeft: any, paramsRight: any) => void
    RemovePoint: (aspectRatio: number) => void
    GetParamsByAspectRatio: (aspectRatio: number) => any
    FullParamsToParams: (fullParams: any) => any
    Update: (aspectRatio: number, screenSize: { width: number, height: number }, screenScale: number) => void
}
