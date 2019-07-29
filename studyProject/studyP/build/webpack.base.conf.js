'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const devMode = process.env.NODE_ENV === 'production'
const tsImportPluginFactory = require('ts-import-plugin');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    vendor:['babel-polyfill','vue', 'vue-router', 'vue-lazyload', 'vue-touch'],
    app: './src/main.js'
    // app: [
    //   'webpack-dev-server/client?http://0.0.0.0:8080/',
    //   './src/main.js'
    // ]
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    sourceMapFilename: "[name].js.map",
    publicPath: devMode
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js','.ts', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      '@assets': resolve('src/assets'),
      '@components': resolve('src/components')
    }
  },
  devServer: {
    disableHostCheck: true,
    port: 8087,
    hot: true,
    host: '127.0.0.1'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          devMode ?  MiniCssExtractPlugin.loader : 'vue-style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.js$/,
        loader: 'happypack/loader?id=happyBabel',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        // test: /\.(jpe?g|gif|svg)(\?.*)?$/,
        exclude:/([HTShareIMG,rewardLogo]|.*share.*)\.(png|jpg)$/,
        loader: 'url-loader',
        options: {
          limit: 2048,
          name: utils.assetsPath('img/[name].[hash:7].[ext]'),
          publicPath: devMode
            ? config.build.imgPublicPath
            : config.dev.imgPublicPath

        }
      },
      {
        test: /([HTShareIMG,rewardLogo]|.*share.*)\.(png|jpg)$/,
        loader: 'url-loader',
        options: {
          limit: 1,
          name: utils.assetsPath('img/[name].[hash:7].[ext]'),
          publicPath: devMode
            ? config.build.imgPublicPath
            : config.dev.imgPublicPath
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]'),
          publicPath: devMode
            ? config.build.imgPublicPath
            : config.dev.imgPublicPath
        }
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [ tsImportPluginFactory(
              {
                "libraryName": "@zz-common/zz-ui",
                "libraryDirectory": "lib",
                "style": true
              }
            ) ]
          }),
          compilerOptions: {
            module: 'es2015'
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 2048,
          name: utils.assetsPath('font/[name].[hash:7].[ext]'),
          publicPath: devMode
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
        }
      },
      {
        test: /\.(vue)$/,
        loader: './auto-supplement-metric'
      },
      {
        test: /\.(vue)$/,
        loader: './compatible-es-module'
      },
      {
        test: /\.worker\.js$/, //以.worker.js结尾的文件将被worker-loader加载
        use: { loader: 'worker-loader' }
      }
    ]
  },
  plugins: [
    new HappyPack({
      id: 'happyBabel',
      loaders: [{
        loader: 'babel-loader?cacheDirectory=true',
      }],
      threadPool: happyThreadPool,
      verbose: true,
    }),
    new VueLoaderPlugin()
  ]
}
