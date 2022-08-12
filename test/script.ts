import Blowfish from '../src/index'

class ObservablePoint {
    _x = 0
    _y = 0

    _listeners: any[] = []

    addListener(listener: any) {
        this._listeners.push(listener)
    }

    set(value: number) {
        this._x = value
        this._y = value

        this._listeners.forEach((listener) => listener(this._x, this._y))
    }
}

class HtmlBlock {
    _x = 0
    _y = 0
    scale = new ObservablePoint()
    domElement = document.createElement('div')

    constructor() {
        document.body.appendChild(this.domElement)
        this.domElement.style.position = 'absolute'
        this.domElement.style.width = '100px'
        this.domElement.style.height = '100px'
        this.domElement.style.background = '#ff0000'

        this.x = 0
        this.y = 0

        this.scale.addListener((x: number, y: number) => {
            this.domElement.style.transform = `scale(${x}, ${y})`
        })
    }

    get x() { return this._x }
    set x(x) {
        this._x = x
        this.domElement.style.left = `${this._x}px`
    }

    get y() { return this._y }
    set y(y) {
        this._y = y
        this.domElement.style.top = `${this._y}px`
    }
}

const block = new HtmlBlock()

// eslint-disable-next-line
const config = {block:[{type:'single',aspectRatio:0.45,params:{x:0,y:0,scale:1}},{type:'single',aspectRatio:2.2222,params:{x:0,y:0,scale:1}}]}

const defaultParams = {
    x: { value: 0.5, editor: { min: 0.0, max: 1.0, step: 0.001 }, interpolation: Blowfish.Interpolation.Lerp },
    y: { value: 0.5, editor: { min: 0.0, max: 1.0, step: 0.001 }, interpolation: Blowfish.Interpolation.Lerp },
    scale: { value: 1.0, editor: { step: 0.02 }, interpolation: Blowfish.Interpolation.Lerp },
}

const defaultFuncSetParams = (target: any, params: any, screenSize: any) => {
    target.x = params.x * screenSize.width
    target.y = params.y * screenSize.height
    target.scale.set(params.scale)
}

const blowfish = new Blowfish(
    'Block',
    { block: { target: block } },
    config,
    defaultParams,
    defaultFuncSetParams,
)

window.addEventListener('resize', () => {
    blowfish.Update(window.innerWidth, window.innerHeight)
})
