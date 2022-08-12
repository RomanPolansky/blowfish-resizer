import { EventEmitter } from '@pixi/utils'
import IBlowfish from './IBlowfish'

export default interface IBlowfishPool extends EventEmitter {
    fishs: IBlowfish[]
    Add: (blowfish: IBlowfish) => void
}
