import IBlowfishPool from '../interfaces/IBlowfishPool'
import IBlowfish from '../interfaces/IBlowfish'
import IContentWindow from '../interfaces/IContentWindow'

declare global {
    interface Window extends IContentWindow {}
}

export default class BlowfishPool implements IBlowfishPool {
    public fishs: IBlowfish[] = []
    public onChangeCallback: Function | null = null

    Add(blowfish: IBlowfish) {
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
