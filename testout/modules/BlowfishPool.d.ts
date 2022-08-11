import { EventEmitter } from '@pixi/utils';
import Blowfish from './Blowfish';
export default class BlowfishPool extends EventEmitter {
    fishs: Blowfish[];
    onChangeCallback: Function | null;
    private constructor();
    Add(blowfish: Blowfish): void;
    static get Instance(): BlowfishPool;
}
