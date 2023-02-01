import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const editorPath = path.resolve(__dirname, './editor/dist')
if (!fs.existsSync(editorPath)) { throw new Error('ERROR: EDITOR NOT FOUND') }

export default {
    mode: 'development',
    entry: { 'script': './test/script.ts' },
    devServer: {
        static: { directory: editorPath },
        open: './blowfish-resizer-editor.html',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './test/index.html',
            filename: 'index.html',
            inject: false,
        }),
    ],
    resolve: {
        extensions: ['.ts', '.js'],
        alias: { 'editor': path.resolve(__dirname, './editor') },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                resolve: { fullySpecified: false },
            },
            {
                test: /\.ts$/i,
                use: ['ts-loader'],
            },
        ],
    },
}
