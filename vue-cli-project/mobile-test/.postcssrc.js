// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {
      browsers: ['> 1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9', 'Android >= 4', 'iOS >= 8'],
      flexbox: 'no-2009'
    },
    "postcss-pxtorem": {
      rootValue: 37.5,
      unitPrecision: 2,
      propList: ['*'],
      selectorBlackList: [],
      replace: true,
      mediaQuery: false,
      minPixelValue: 2
    },
  }
}
