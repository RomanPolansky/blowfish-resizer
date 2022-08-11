interface IResolutionElement {
    width: number;
    height: number;
    aspectRatio?: number;
}
declare class Blowfish {
    name: string;
    defaultParams: any;
    defaultFuncSetParams: any;
    resolutions: IResolutionElement[];
    mapElements: any;
    prevScreenSize: {
        width: number;
        height: number;
    };
    constructor(name: string, elements: any, curvesConfig: any, defaultParams: any, defaultFuncSetParams: any, resolutions?: IResolutionElement[]);
    get MaxAspectRatio(): number | undefined;
    get MinAspectRatio(): number | undefined;
    SetResolutions(resolutions: IResolutionElement[]): void;
    SetElements(elements: any, curvesConfig: any): void;
    FixParams(defParams: any, fixParams: any): any;
    CreateDefaultCurvePointsForElements(): void;
    Update(width?: number, height?: number): void;
}
declare namespace Blowfish {
    const Interpolation: {
        Left: (leftValue: number, rightValue: number, t: number) => number;
        Lerp: (leftValue: number, rightValue: number, t: number) => number;
        Right: (leftValue: number, rightValue: number, t: number) => number;
    };
}
export default Blowfish;
