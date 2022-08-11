/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import BlowfishEditor from './modules/BlowfishEditor'

window.addEventListener('load', () => {
    const iframe = document.getElementById('game_iframe') as HTMLIFrameElement
    iframe.src = './index.html'

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const editor = new BlowfishEditor()
    let mPos: number
    let mPos2: number
    const resizeEl = document.getElementById('resize')!
    const resizeEl2 = document.getElementById('resize2')!

    function resize(e: MouseEvent) {
        const parent: any = resizeEl.parentNode
        const dy = mPos - e.y
        mPos = e.y
        parent.style.height = `${parseInt(getComputedStyle(parent, '').height, 10) + dy}px`
    }

    resizeEl.addEventListener('mousedown', (e) => {
        mPos = e.y
        document.addEventListener('mousemove', resize, false)
    }, false)

    document.addEventListener('mouseup', () => { document.removeEventListener('mousemove', resize, false) }, false)

    function resize2(e: MouseEvent) {
        const parent: any = resizeEl2.parentNode
        const dx = mPos2 - e.x
        mPos2 = e.x
        parent.style.width = `${parseInt(getComputedStyle(parent, '').width, 10) + dx}px`
    }

    resizeEl2.addEventListener('mousedown', (e) => {
        mPos2 = e.x
        document.addEventListener('mousemove', resize2, false)
    }, false)

    document.addEventListener('mouseup', () => { document.removeEventListener('mousemove', resize2, false) }, false)
})
