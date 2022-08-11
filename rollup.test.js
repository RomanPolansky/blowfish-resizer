import fs from 'fs'
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
        input: './test/index.html',
        output: { dir: outputPathEditor },
        plugins: [html({ extractAssets: false })],
    },
    {
        input: './test/script.js',
        output: [
            {
                format: 'iife',
                name: 'script',
                file: path.resolve(outputPathEditor, './script.js'),
                banner,
            },
        ],
    },
]
