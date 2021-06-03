import applyMixin from './mixin.js';
import ModuleCollection from './modeule/module_collection.js';
import { isPromis, forEachValue } from "./utils.js";

let Vue;

export class Store {
  constructor (options = {}) {
    // 如果此时未安装Vue，且检测到该环境下有Vue存在，则安装一下
    if (!Vue && window !== undefined && window.Vue) {
      install(window.Vue);
    }
    
    const { plugins, strict } = options;
    // 标识数据修改是否由commit触发
    this._committing = false;
    // actions方法收集  所有action方法都在里面，包括模块内，如car模块a内命名：car/a 且都将返回promise
    this._actions = Object.create(null);
    // actions事件触发时候监听事件队列，由于actions返回promise，其事件对象形如：[{ before: fn, after: fn }]
    this._actionSubscribers = [];
    // mutation方法收集
    this._mutations = Object.create(null);
    // 真正的getter方法
    this._wrappedGetters = Object.create(null);
    // 通过option生成的模块树，比较原始的信息存储地
    this._modules = new ModuleCollection(options);
    // 命名空间子模块收集
    this._modulesNamespaceMap = options.create(null);
    // commit事件回调队列
    this._subscribers = [];
    this._watcherVM = new Vue();
    // 各个子模块的getter代理对象缓存
    this._makeLocalGettersCache = Object.create(null);
    this.dispatch = this.dispatch.bind(this);
    this.commit = this.commit.bind(this);

    this.strict = strict;

    const state = this._modules.root.state;

    installModule(this, state, [], this._modules.root);

    resetSoreVM(this, state);
  }

  dispatch () {}
  commit () {}

  _withCommit (fn) {
    const commiting = this._committing;
    this._committing = true;
    fn();
    this._committing = commiting;
  }
}

function resetSoreVM (store, state, hot) {
  const oldVm = store._vm;

  store.getters = {};
  store._makeLocalGettersCache = Object.create(null);

  const wrappedGetters = store._wrappedGetters;
  const computed = {};

  forEachValue(wrappedGetters, (fn, key) => {
    computed[key] = () => fn(store);
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
      enumerable: true
    })
  })

  const silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  })
  Vue.config.silent = silent;
  
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      store._withCommit(() => {
        oldVm._data.$$state = null;
      })
    }
    Vue.nextTick(() => oldVm.$destroy());
  }
}

function installModule (store, rootState, path, module, hot) {
  const isRoot = path.length === 0;
  const namespace = store._modules.getNamespace(path);
  
  // 将带有命名空间的module按照命名空间划分存储
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }
  if (!isRoot && !hot) {
    // 响应式设置子模块的state
    const parentState = getNamespaceState(rootState, path.slice(0, -1));
    const moduleName = path[path.length - 1];
    if (parentState) {
      store._withCommit(() => {
        Vue.set(parentState, moduleName, module.state);
      })
    }
  }
  // 在此创建当前命名空间的上下文，此处是实现module命名空间的关键, 通过该处理，实现a模块下直接调用b方法，而实际调用到store下的a/b方法
  const local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation((mutation, key) => {
    const namespaceType = namespace + key;
    regsiterMutation(store, namespaceType, mutation, local);
  });

  module.forEachAction((action, key) => {
    const namespaceType = namespace + key;
    regsiterAction(store, namespaceType, action, local);
  })

  module.forEachGetter((getter, key) => {
    const namespaceType = namespace + key;
    regsiterGetter(store, namespaceType, getter, local);
  })

  module.forEachChild((child, key) => {
    installModule(store, module.state, path.concat(key), child, hot);
  })
}

function regsiterMutation (store, type, handler, local) {
  const entry = (store._mutations[type] || store._mutations[type] = []);
  entry.push((payload) => {
    handler.call(store, local.state, payload);
  })
}

function regsiterAction (store, type, handler, local) {
  const entry = (store._mutations[type] || store._mutations[type] = []);
  entry.push((payload) => {
    let res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootState: store.state,
      rootGetters: store.getters
    });
    if (!isPromis(res)) {
      res = Promise.resolve(res);
    }
    return res;
  })
}

function forEachGetter (store, type, handler, local) {
  const entry = (store._mutations[type] || store._mutations[type] = []);
  entry.push(() => {
    return handler(local.state, local.getters, store.state, store.getters);
  })
}

function makeLocalContext (store, namespace, path) {
  const noNameSpace = namespace === '';
  const local = {
    dispatch: noNameSpace ? store.dispatch : (_type, _payload, _options) => {
      const arg = unifyObjectStyle(_type, _payload, _options);
      const { payload, options } = arg;
      let { type } = arg;
      if (!options || !options.root) {
        type = namespaced + type;
        if (!store._actions[type]) return;
      }
      return store.dispatch(type, payload);
    },
    commit: noNameSpace ? store.commit : (_type, _payload, _options) => {
      const arg = unifyObjectStyle(_type, _payload, _options);
      const { payload, options } = arg;
      let { type } = arg;
      if (!options || !options.root) {
        type = namespaced + type;
        if (!store._mutations[type]) return
      }
      store.commit(type, payload, options);
    }
  };
  Object.defineProperties(local, {
    getters: {
      // get代理 将命名空间下的getter 代理到store的getter上
      get: noNameSpace ? store.getters : makeLocalGetters(store, namespaced)
    },
    state: {
      get: () => getNamespaceState(store.state, path)
    }
  })

  return local;
}

function makeLocalGetters (store, namespace) {
  if (!store._makeLocalGettersCache[namespace]) {
    const proxyGetter = {};
    const splitPos = namespace.length;
    Object.keys(store.getters).forEach(key => {
      if (key.slice(0, splitPos) !== namespace) {
        return;
      }
      const type = key.slice(splitPos);
      Object.defineProperty(proxyGetter, key, {
        get: () => store.getters[key],
        enumerable: true
      })
    })
    store._makeLocalGettersCache[namespace] = proxyGetter;
  }
  return store._makeLocalGettersCache[namespace];
}

function unifyObjectStyle (type, payload, options) {
  if (!Array.isArray(type) && typeof type === 'objec' && type.type) {
    options = payload
    payload = type
    type = type.type
  }
  return { type, payload, options }
}

function getNamespaceState (rootState, path) {
  return path.reduce((state, key) => state[key], rootState)
}

function enableStrictMode(store) {
  store._vm.$watch(function () { return store._vm.$$state }, () => {

  }, { deep: true, sync: true })
}

export function install (_Vue, options) {
  if (Vue && _Vue === Vue) {
    return;
  }
  Vue = _Vue;
  applyMixin(Vue);
}