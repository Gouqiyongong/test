export default function (Vue) {
  const version = Number(Vue.version.split('.')[0]);
  // 全局混合this.$store，为后面store使用
  if (version >= 2) {
    Vue.mixin({ beforCreated: vuexInit });
  } else {
    // 低版本重写Vue.prototype._init, 以达到对各个组件$store注入
    const init = Vue.prototype._init;
    Vue.prototype._init = function (options = {}) {
      options.init = options.init ? [vuexInit].concat(options.init) : vuexInit;
      init.call(this, options);
    }
  }
}

function vuexInit() {
  const options = this.options;
  if (options.store) {
    this.$store = typeof options.store === 'function' ? options.store() : options.store;
  } else if (options.parent && options.parent.$store) {
    this.$store = options.parent.$store;
  }
}