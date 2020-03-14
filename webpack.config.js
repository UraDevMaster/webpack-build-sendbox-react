const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const path = require("path");



module.exports = (env={}) => {
    const { mode = 'development' } = env;

    const isProd = mode === 'production';
    const isDev = mode === 'development';

    const getStyleLoaders = () => {
        return [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader'
        ];
    };

    const getOptimization = () => {
        const config = {
            splitChunks: {
                chunks: "all"
            }
        }
        console.log("is prod", isProd);
        if(isProd) {
            config.minimizer = [
                new OptimizeCssAssetWebpackPlugin(),
                new TerserPlugin()
            ]
        }
        return config
    }

    const getPlugins = () => {
        const plugins = [
            new HtmlWebpackPlugin({
                title: 'Hello World',
                buildTime: new Date().toISOString(),
                template: 'public/index.html',
                minify: {
                    collapseWhitespace: true
                }
            }),
            new CleanWebpackPlugin(),
            new CopyWebpackPlugin([
                {
                  from: path.resolve(__dirname, 'src/assets/img/favicon.png'),
                  to: path.resolve(__dirname, 'dist/images')
                }
              ])
        ];

        if (isProd) {
            plugins.push(new MiniCssExtractPlugin({
                filename: 'main-[hash:8].css'
            })
            );
        }

        return plugins;
    };

    return {
        mode: isProd ? 'production' : isDev && 'development',

        output: {
            filename: isProd ? '[name]-[hash:8].js' : undefined
        },
        resolve: {
            extensions: ['.js', '.json', '.png', '.jpg']
          },
        optimization: getOptimization(),
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.(png|jpg|jpeg|svg)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: "images",
                                name: "[name]-[sha1:hash:7].[ext]"
                            }
                        },

                    ]
                },
                {
                    test: /\.(ttf|woff|woff2|eot)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: "fonts",
                                name: "[name].[ext]"
                            }
                        },

                    ]
                },
                {
                    test: /\.(css)$/,
                    use: getStyleLoaders(),
                },
                {
                    test: /\.(s[ca]ss)$/,
                    use: [...getStyleLoaders(), "sass-loader"]
                }
            ]
        },
        plugins: getPlugins(),
        devtool: isDev ? "source-map" : "",
        devServer: {
            open: true
        }
    }

}