const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: './code/src/main.js',
    output: {
        filename: 'bundle.min.js', 
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'production', 
    plugins: [
        new HtmlWebpackPlugin({
            template: './code/index.html', // HTML template file
            inject: 'body', // Inject the script tag at the end of the body
        }),
    ],
    // optimization: {
    //     minimize: true,
    //     minimizer: [
    //         new TerserPlugin({
    //             terserOptions: {
    //                 compress: {
    //                     drop_console: true,
    //                 },
    //                 mangle: {
    //                     properties: {
    //                         regex: /.*/,
    //                     },
    //                 },
    //                 output: {
    //                     comments: false,
    //                 },
    //             },
    //             extractComments: false,
    //         }),
    //     ],
    // },
};

// setup 
// npm install 
// npm init -y 
// npm install terser-webpack-plugin --save-dev
// npm install html-webpack-plugin --save-dev

//run with 
// npx webpack --config webpack.config.js
// or 
// npm run build