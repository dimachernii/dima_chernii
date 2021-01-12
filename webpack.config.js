const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackDevServer = require('webpack-dev-server');
const OptimazeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if(!isDev) {
        config.minimizer = [
            new OptimazeCssAssetsWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config;
}
const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`
const cssLoaders = extra => {
    const loaders =  [{
        loader: MiniCssExtractPlugin.loader,
    },'css-loader']

    if(extra) {
        loaders.push(extra);
    }

    return loaders;
}
const babelOptions = preset => {
    const opts =
        {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties']
        }

    if(preset)
        opts.presets.push(preset);

    return opts
}
const plugins = () => {
    const base = [
        new HTMLWebpackPlugin({
            title: 'Webpack Dima',
            template: './index.html',
            minify: {
                collapseWhitespace: !isDev
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/favicon.ico'),
                    to: path.resolve(__dirname, 'dist')
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: filename('css')
        }),

    ]



    return base
}
module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: "development",
    target: 'web',
    entry: {
        main: ['@babel/polyfill', './index.jsx'],
        analytics: './analytics.ts'
    },
    output: {
        filename: filename("js"),
        path: path.resolve(__dirname, 'dist'),
        publicPath: '',

    },
    resolve: {
        alias: {
            '@models': path.resolve(__dirname, 'src/models'),
            '@': path.resolve(__dirname, 'src'),
            process: "process/browser"
        },
    },
    optimization: optimization(),
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        publicPath: '/',
        open: true,
        watchContentBase: true,
        port: 8080,
    },
    devtool: isDev ? 'source-map': false,
    plugins: plugins(),
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.less$/,
                use: cssLoaders('less-loader')
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                  {
                    loader: 'file-loader'
                  }
                ]
            },
            {
                test: /\.xml$/,
                use: [
                  {
                    loader: 'xml-loader'
                  }
                ]
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions()
                }
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions( "@babel/preset-typescript")
                }
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions( "@babel/preset-react")
                }
            }

        ]
    }

}

