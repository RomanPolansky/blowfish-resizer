import IBlowfish from './IBlowfish'

export default interface IBlowfishPool {
    fishs: IBlowfish[]
    Add: (blowfish: IBlowfish) => void
}
