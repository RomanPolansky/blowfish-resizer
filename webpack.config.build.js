import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const outputDir = path.resolve(__dirname, './lib')
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir)

export default {
    mode: 'development',
    entry: './src/index.ts',
    output: {
        path: outputDir,
        filename: 'index.js',
        library: {
            name: 'blowfish-resizer',
            type: 'commonjs-module',
        },
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            'editor': path.resolve(__dirname, './editor'),
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                resolve: { fullySpecified: false },
                use: ['babel-loader'],
            },
            {
                test: /\.ts$/i,
                use: ['babel-loader', 'ts-loader'],
            },
        ],
    },
}
