import path from 'path'
import { fileURLToPath } from 'url'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// eslint-disable-next-line no-console
console.log('EDITOR BUILDING...')

export default {
    mode: 'production',
    entry: './src/blowfish-resizer-editor.ts',
    output: {
        path: `${__dirname}/dist`,
        filename: 'blowfish-resizer-editor.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/blowfish-resizer-editor.html',
            filename: 'blowfish-resizer-editor.html',
            inject: false,
        }),
    ],
    resolve: { extensions: ['.ts', '.js'] },
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
