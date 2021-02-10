const  path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


module.exports = {
    entry: './src/index.js',
    output: {
        filename: isDev ? `assets/js/[name].js` : `assets/js/[name].[contenthash].js`,
        path: path.resolve(__dirname, "dist"),
        publicPath: ''
    },
    optimization: {
        minimize: true,
        minimizer: [ new CssMinimizerPlugin({
            sourceMap: true,
        })],
        splitChunks: {
            chunks: "all"
        }
    },
    devtool: isDev ? 'inline-source-map' : false,
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
    },
    plugins: [
       new CleanWebpackPlugin(),
       new HtmlWebpackPlugin({
         title: 'Output Management',
         template: './src/index.html',
         minify: {
             collapseWhitespace: !isDev
          }
       }),
       new MiniCssExtractPlugin(
        {
            filename: isDev ? `assets/css/[name].css` : `assets/css/[name].[contenthash].css`
        })
    ],

    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../../',
                        },
                    },
                  { loader: 'css-loader', options: { sourceMap: true } },
                  { loader: 'sass-loader', options: { sourceMap: true } },
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: isDev ?  'assets/images/[name][ext][query]' : 'assets/images/[name].[contenthash][ext][query]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: isDev ? 'assets/fonts/[name][ext][query]' : 'assets/fonts/[name].[contenthash][ext][query]'
                }
            },
        ]
    }
}