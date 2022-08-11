import path from 'path'
import { fileURLToPath } from 'url'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
    mode: 'development',
    entry: {
        'script': './test/script.js',
        'blowfish-resizer-editor': './src/blowfish-resizer-editor.ts',
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        open: './blowfish-resizer-editor.html',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './test/index.html',
            filename: 'index.html',
            inject: false,
        }),
        new HtmlWebpackPlugin({
            template: './src/html/blowfish-resizer-editor.html',
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
