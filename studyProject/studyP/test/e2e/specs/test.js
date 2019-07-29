// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'default e2e tests': function (browser) {
    const devServer = browser.globals.devServerURL
    
    browser
      .url(devServer)
      .assert.elementPresent('#buyscroll')
      .url('https://wxzhuanzhuan.58.com/Mzhuanzhuan/ZZBook/#/newSellBookHomeSimple')
      // .url('https://wxzhuanzhuan.58.com/Mzhuanzhuan/ZZBook/#/NewSellBookPage')
  }
}
