export declare const defaultParams: {
    x: {
        value: number;
        editor: {
            min: number;
            max: number;
            step: number;
        };
        interpolation: (leftValue: number, rightValue: number, t: number) => number;
    };
    y: {
        value: number;
        editor: {
            min: number;
            max: number;
            step: number;
        };
        interpolation: (leftValue: number, rightValue: number, t: number) => number;
    };
    scale: {
        value: number;
        editor: {
            step: number;
        };
        interpolation: (leftValue: number, rightValue: number, t: number) => number;
    };
};
export declare const defaultFuncSetParams: (target: any, params: any, screenSize: {
    width: number;
    height: number;
}) => void;
export declare const defaultParamsPx: {
    x: {
        value: number;
        editor: {
            min: number;
            max: number;
            step: number;
        };
        interpolation: (leftValue: number, rightValue: number, t: number) => number;
    };
    y: {
        value: number;
        editor: {
            min: number;
            max: number;
            step: number;
        };
        interpolation: (leftValue: number, rightValue: number, t: number) => number;
    };
    scale: {
        value: number;
        editor: {
            step: number;
        };
        interpolation: (leftValue: number, rightValue: number, t: number) => number;
    };
};
export declare const defaultFuncSetParamsPx: (target: any, params: any) => void;
