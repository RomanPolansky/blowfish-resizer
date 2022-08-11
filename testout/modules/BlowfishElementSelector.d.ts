import { EventEmitter } from '@pixi/utils';
import BlowfishEditor, { IMixedPool } from './BlowfishEditor';
export default class BlowfishElementSelector extends EventEmitter {
    pool: IMixedPool;
    controller: BlowfishEditor;
    prevFishsCount: number;
    private pane;
    constructor(pool: IMixedPool, controller: BlowfishEditor);
    get HTMLElement(): any;
    Update(): void;
    UpdateElements(): void;
    UpdateTabs(): void;
}
