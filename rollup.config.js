import fs from 'fs'
import typescript from '@rollup/plugin-typescript'
// import resolve from '@rollup/plugin-node-resolve'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pkg = JSON.parse(fs.readFileSync('package.json', { encoding: 'utf8' }))
const banner = `/* blowfish-resizer@${pkg.version} */`

const outputDir = path.resolve(__dirname, './lib')
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir)

export default {
    input: './src/index.ts',
    plugins: [
        typescript({ declaration: true, exclude: ['./test/**'] }),
    ],
    output: [
        {
            format: 'es',
            file: path.resolve(outputDir, './index.js'),
            name: 'blowfish-resizer',
            banner,
        },
    ],
}
