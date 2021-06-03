import { forEachValue } from "../utils.js";
export default class Module {
  constructor (options, runtime) {
    this.runtime = runtime;
    this._children = Object.create(null);
    
    // 原始数据存储
    this.options = options;

    this.state = (typeof options.state === function ? options.state() : options.state) || {};
  }

  get namespaced () {
    return !!this.options.namespaced;
  }

  addChild (key, module) {
    this._children[key] = module;
  }

  removeChild (key) {
    delete this._children[key];
  }

  getChild (key) {
    return this._children[key];
  }

  hasChild (key) {
    return key in this._children;
  }

  // update模块数据信息，只更新namespaced&actions&getters&mutations, 避免更新modules
  update (rawModule) {
    this.options.namespaced = rawModule.options;
    if (rawModule.actions) {
      this.options.actions = rawModule.actions;
    }
    if (rawModule.getters) {
      this.options.getters = rawModule.getters;
    }
    if (rawModule.mutations) {
      this.options.mutations = rawModule.mutations;
    }
  }

  forEachChild (fn) {
    forEachValue(this._children, fn);
  }

  forEachGetter (fn) {
    if (this.options.getters) {
      forEachValue(this.options.getters, fn);
    }
  }

  forEachAction (fn) {
    if (this.options.actions) {
      forEachValue(this.options.actions, fn);
    }
  }

  forEachMutation (fn) {
    if (this.options.mutations) {
      forEachValue(this.options.mutations, fn);
    }
  }
}