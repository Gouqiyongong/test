import Vue from 'vue'
import App from './App'
import router from './router'

import flexible from './libs/flexible.js'

/* 初始化css单位 */
flexible()

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
