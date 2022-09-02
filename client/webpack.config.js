const HtmlWebpackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')

const path = require('path')

module.exports = {
    entry: path.join(__dirname, '/src/index.tsx'),
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'client.bundle.js',
    },
    devServer: {
        port: 8080,
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        modules: ['node_modules', path.join(__dirname, 'src')],
        alias: {
            shared: path.resolve(__dirname, '../shared/src'),
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '/src/index.html'),
            favicon: path.join(__dirname, '/src/favicon.ico'),
        }),
        new Dotenv(),
    ],
}
