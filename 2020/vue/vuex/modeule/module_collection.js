import { forEachValue } from '../utils.js';

export default class {
  constructor (options) {
    this.register([], options, false);
  }

  // 注册module,runtime标识是否是运行时注入的
  register (path, options, runtime = true) {
    const newModule = new Module(options, runtime);
    if (path.length === 0) {
      this.root = newModule;
    } else {
      const parent = this.get(path.slice(0, -1));
      parent.addChild(path[path.length - 1], newModule);
    }
    if (options.modules) {
      forEachValue(options.module, (value, key) => {
        this.register(path.concat(key), value, runtime);
      })
    }
  }

  // 通过path获取module
  get (path) {
    return path.reduce((module, key) => {
      return module.getChild(key);
    }, this.root);
  }

  unregister (path) {
    const parent = this.get(path.slice(0, -1));
    const key = path[path.length - 1];

    if (parent && key && parent.getChild(key) && !parent.getChild(key).runtime) {
      return;
    }

    parent.removeChild(key);
  }

  isRegistered (path) {
    const parent = this.get(path.slice(0, -1));
    const key = path[path.length - 1];
    parent && key && parent.hasChild(key);
  }

  // 通过路径以及路径上各个module的namespaced拼接命名空间命名
  getNamespace (path) {
    let module = this.root;
    path.reduce((str, key) => {
      module = module.getChild(key);
      return str + (module.namespaced ? (key + '/') : '');
    }, '');
  }

  // 更新根节点
  update (rawModule) {
    update ([], this.root, rawModule);
  }
}

function update (path, module, rawModule) {
  module.update(rawModule);

  if (rawModule.modules) {
    // 递归调用更新子模块
    Object.keys(rawModule.modules).forEach(key => {
      if (!module.getChild(key)) {
        return;
      }
      update(path.concat(key), module.getChild(key), rawModule.modules[key]);
    })
  }
}