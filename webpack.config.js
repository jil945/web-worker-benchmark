const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        main: "./src/main.js",
        "decrypt-worker": "./src/components/decrypt-worker.js",
    },
    devtool: "inline-source-map",
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./src/index.html",
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                collapseInlineTagWhitespace: true,
                removeAttributeQuotes: true,
                decodeEntities: true
            },
            scripts: [
                {
                    src: "./src/main.js",
                    type: "text/javascript"
                }
            ]
        })
    ],
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            }
        ]
    }
};