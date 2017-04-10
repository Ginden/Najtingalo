const path = require('path');
const webpack = require('webpack');
const BabiliPlugin = require("babili-webpack-plugin");


const getBasic = ()=>( {
    entry: './lib/Najtingalo.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'Najtingalo.js',
        libraryTarget: 'umd',
        library: 'Najtingalo'
    },
    module: {
        loaders: []
    },
    plugins: []
});

const basicConfiguration = getBasic();
const prodConfig = getBasic();
const docsConfig = getBasic();


prodConfig.output.filename = 'Najtingalo.min.js';
prodConfig.plugins.push(new BabiliPlugin({}, {}));


docsConfig.output.path = path.join(__dirname, 'docs');
docsConfig.output.libraryTarget = 'var';


module.exports = [basicConfiguration, prodConfig, docsConfig];