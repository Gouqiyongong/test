'use strict'
const utils = require('./utils')
const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap


module.exports = {
  //vue-loader v15 下列选项已被废弃
  // loaders: utils.cssLoaders({
  //   sourceMap: sourceMapEnabled,
  //   extract: isProduction
  // }),
  // cssSourceMap: sourceMapEnabled,
  transformAssetUrls: {
    video: 'src',
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
