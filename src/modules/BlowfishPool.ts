/* eslint-disable import/no-extraneous-dependencies */
import { EventEmitter } from '@pixi/utils'
import Blowfish from './Blowfish'

export default class BlowfishPool extends EventEmitter {
    public fishs: Blowfish[] = []
    public onChangeCallback: Function | null = null

    private constructor() {
        super()
    }

    Add(blowfish: Blowfish) {
        this.fishs.push(blowfish);
        if (typeof this.onChangeCallback === 'function') {
            this.onChangeCallback(this.fishs)
        }
    }

    // singleton
    static get Instance() {
        if (window.blowfishPool === undefined) {
            window.blowfishPool = new BlowfishPool();
        }
        return window.blowfishPool;
    }
}
