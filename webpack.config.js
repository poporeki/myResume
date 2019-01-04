const path = require('path');

module.exports = {
    entry: './app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    target: 'node',
    externals: _externals,
    node: {
        console: true,
        global: true,
        process: true,
        Buffer: true,
        __filename: true,
        __dirname: true,
        setImmediate: true
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, '../dist'),
        host: 'localhost',
        campress: true,
        port: 8888
    }
}

function _externals() {
    let manifest = require('./package.json');
    let dependencies = manifest.dependencies;
    let externals = {};
    for (let p in dependencies) {
        externals[p] = 'commonjs ' + p;
    }
    return externals;
}