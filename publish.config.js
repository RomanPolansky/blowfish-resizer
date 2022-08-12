import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const outputDir = path.resolve(__dirname, './lib')
const outputPath = path.resolve(outputDir, './editor')
const editorPath = path.resolve(__dirname, './editor/dist')

if (!fs.existsSync(editorPath)) throw new Error('editor not found')

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir)
if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath)

const files = fs.readdirSync(editorPath)
files.forEach((file) => {
    if (!fs.lstatSync(path.join(editorPath, file)).isDirectory()) {
        fs.copyFileSync(path.resolve(editorPath, file), path.resolve(outputPath, file))
    }
})
