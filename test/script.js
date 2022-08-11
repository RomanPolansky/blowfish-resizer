const block = document.getElementById('blok')

const config = {}

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
