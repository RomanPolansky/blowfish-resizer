import { Blowfish, defaultFuncSetParams, defaultParams } from '../src/index'

class ObservablePoint {
    _x = 0
    _y = 0

    _listeners = []

    addListener(listener) {
        this._listeners.push(listener)
    }

    set(value) {
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

        this.scale.addListener((x, y) => {
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

const config = {block:[{type:'single',aspectRatio:0.45,params:{x:0,y:0,scale:1}},{type:'single',aspectRatio:2.2222,params:{x:0,y:0,scale:1}}]}

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
