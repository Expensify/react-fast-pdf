import path from 'path';
import {fileURLToPath} from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const pdfjsPkgUrl = import.meta.resolve('pdfjs-dist/package.json');
const pdfjsPkgPath = fileURLToPath(pdfjsPkgUrl);

const cMapsDir = path.join(path.dirname(pdfjsPkgPath), 'cmaps');

export default {
    entry: path.join(dirname, 'src', 'index.js'),
    output: {
        path: path.resolve(dirname, 'dist'),
        filename: 'bundle.js',
    },
    resolve: {
        modules: [path.join(dirname, 'src'), 'node_modules'],
        alias: {
            react: path.join(dirname, 'node_modules', 'react'),
        },
        extensions: ['.tsx', '.ts', '.js'],
    },
    devServer: {
        port: 8080,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            // We are importing this worker as a string by using asset/source otherwise it will default to loading via an HTTPS request later.
            // This causes issues if we have gone offline before the pdfjs web worker is set up as we won't be able to load it from the server.
            {
                // eslint-disable-next-line prefer-regex-literals
                test: new RegExp('node_modules/pdfjs-dist/build/pdf.worker.min.mjs'),
                type: 'asset/source',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(dirname, 'public', 'index.html'),
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: cMapsDir,
                    to: 'cmaps/',
                },
            ],
        }),
    ],
};
