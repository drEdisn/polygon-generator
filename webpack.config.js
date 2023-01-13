const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { extendDefaultPlugins } = require("svgo");
const CopyPlugin = require("copy-webpack-plugin");
const { merge } = require('webpack-merge');

module.exports = ({ mode }) => {
  const envConfig = mode !== "development" ? require('./webpack.prod.config') : require('./webpack.dev.config');
  const isProd = mode === "production";

  const filename = (ext) => mode ? `[name].${ext}` : `[name].[contenthash].${ext}`;
  const optimization = (isProd) => {
    const configObj = {
      splitChunks: {
        chunks: 'all'
      }
    };
  
    if (isProd) {
      configObj.minimizer = [
        new CssMinimizerPlugin(),
        new TerserPlugin()
      ]
    };
  
    return configObj;
  }
  const plugins = (isProd) => {
    const basePlugins = [
      new HTMLWebpackPlugin({
        template: path.resolve(__dirname, 'src/index.html'),
        filename: 'index.html',
        minify: { collapseWhitespace: isProd },
        inject: 'body'
      }),
      new MiniCssExtractPlugin({
        filename: `./css/${filename('css')}`
      }),
      // new CopyPlugin({
      //   patterns: [
      //     { from: "images", to: "images" },
      //   ],
      // }),
    ];
  
    if (isProd) {
      basePlugins.push(
        new ImageMinimizerPlugin({
          minimizer: {
            implementation: ImageMinimizerPlugin.imageminMinify,
            options: {
              plugins: [
                ["gifsicle", { interlaced: true }],
                ["jpegtran", { progressive: true }],
                ["optipng", { optimizationLevel: 5 }],
                [
                  "svgo",
                  {
                    plugins: extendDefaultPlugins([
                      {
                        name: "removeViewBox",
                        active: false,
                      },
                      {
                        name: "addAttributesToSVGElement",
                        params: {
                          attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
                        },
                      },
                    ]),
                  },
                ],
              ],
            },
          },
        })
      )
    }
  
    return basePlugins;
  };

  const baseConfig = {
    context: path.resolve(__dirname, 'src'),
    entry: './ts/index.ts',
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      filename: `./js/${filename('js')}`,
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.html$/,
          use: 'html-loader'
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.s[ac]ss$/,
          use: [{
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
            }, 
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              }
      
            },
          ],
        },
      ]
    }
  }

  return merge(baseConfig, {optimization: optimization(isProd), plugins: plugins(isProd)}, envConfig);
};