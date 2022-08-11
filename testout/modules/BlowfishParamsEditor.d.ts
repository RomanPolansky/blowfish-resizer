import { EventEmitter } from '@pixi/utils';
import BlowfishEditor, { IMixedPool } from './BlowfishEditor';
export default class BlowfishParamsEditor extends EventEmitter {
    private pane;
    private pool;
    private controller;
    constructor(pool: IMixedPool, controller: BlowfishEditor);
    get HTMLElement(): any;
    FixStyle(input: any): void;
    Update(): void;
}
