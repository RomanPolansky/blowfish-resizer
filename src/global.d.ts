import BlowfishPool from './modules/BlowfishPool'

declare global {
    interface Window {
        blowfishPool: BlowfishPool
        blowfishClipboard: any
    }
}
