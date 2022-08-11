import Blowfish from './Blowfish';
import BlowfishAspectRatioView from './BlowfishAspectRatioView';
import BlowfishElement from './BlowfishElement';
import BlowfishElementSelector from './BlowfishElementSelector';
import BlowfishParamsEditor from './BlowfishParamsEditor';
import BlowfishPool from './BlowfishPool';
export interface IMixedPool extends BlowfishPool {
    selectedFish: Blowfish | null;
    selectedElement: BlowfishElement | null;
    aspectRatio: number;
    InitMixin: () => void;
    ResizeAllFish: () => void;
    SetAspectRatio: (aspectRatio: number) => void;
    SetSelectFish: (fish: Blowfish) => void;
    SetSelectElement: (element: BlowfishElement) => void;
    EmitUpdate: () => void;
}
export default class BlowfishEditor {
    pool: IMixedPool;
    elementSelector: BlowfishElementSelector;
    aspectRatioView: BlowfishAspectRatioView;
    paramsEditor: BlowfishParamsEditor;
    constructor();
    Connect(): void;
    Init(pool: BlowfishPool): void;
    UpdateChangedParams(): void;
    EmitUpdate(): void;
    SelectFish(fish: Blowfish): void;
    SelectElement(element: BlowfishElement): void;
    SetAspectRatio(aspectRatio: number): void;
    AddPoint(element: BlowfishElement, aspectRatio: number, params?: any): void;
    AddPointD(element: BlowfishElement, aspectRatio: number, priorityLeft: boolean, paramsLeft: any, paramsRight: any): void;
    RemovePoint(element: BlowfishElement, aspectRatio: number): void;
    ExportData(): void;
    CopyStringToClipboard(str: string): void;
}
