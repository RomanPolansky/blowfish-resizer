import fs from 'fs'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import nodePolyfills from 'rollup-plugin-node-polyfills'
import html from '@web/rollup-plugin-html'
import path from 'path'

const pkg = JSON.parse(fs.readFileSync('package.json', { encoding: 'utf8' }))
const banner = `/* blowfish-resizer@${pkg.version} */`

if (!process.env.OUTPUT) throw new Error('invalid output')

const outputPathIndex = process.env.OUTPUT
const outputPathEditor = path.resolve(outputPathIndex, './editor')

if (!fs.existsSync(outputPathIndex)) fs.mkdirSync(outputPathIndex)
if (!fs.existsSync(outputPathEditor)) fs.mkdirSync(outputPathEditor)

export default [
    {
        input: './src/index.ts',
        plugins: [typescript({ declaration: true, exclude: ['./src/editor.ts'] })],
        output: [
            {
                format: 'es',
                file: path.resolve(outputPathIndex, './blowfish-resizer.module.js'),
                name: 'blowfish-resizer',
                banner,
            },
        ],
    },
    {
        input: './src/blowfish-resizer-editor.ts',
        plugins: [
            nodePolyfills(),
            resolve(),
            commonjs({ include: ['node_modules/**'] }),
            typescript(),
        ],
        output: [
            {
                format: 'iife',
                name: 'editor',
                file: path.resolve(outputPathEditor, './blowfish-resizer-editor.js'),
                banner,
            },
        ],
    },
    {
        input: './src/html/blowfish-resizer-editor.html',
        output: { dir: outputPathEditor },
        plugins: [html({ extractAssets: false })],
    },
]
