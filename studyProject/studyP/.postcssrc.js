// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  plugins: {
    "postcss-import": {},
    autoprefixer: {
      browsers: ['> 1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9', 'Android >= 4', 'iOS >= 8'],
      flexbox: 'no-2009'
    },
    "@zz-biz/postcss-replace": {
      test: /\/node_modules\/@zz-common\/zz-ui\/|\\node_modules\\@zz-common\\zz-ui\\/g,
      mappers: [
        {
          source: /([2-9]\d*|1\d+)px/gi,
          target: function(match) {
            return parseInt(match) * 2 + 'px';
          }
        }
      ]
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
    cssnano: {
      autoprefixer: false,
      zindex: false,
      discardComments: {
        removeAll: true
      },
      reduceIdents: false
    }
  }
}
