function observer (value) {
  if (!value && typeof value !== 'object') {
    return;
  }
  Object.keys(value).forEach(key => {
    defineReactive(value, key, value[key]);
  })
}

function defineReactive (obj, key, val) {
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get () {
      if (Dep.target) {
        dep.push(Dep.target);
      }
      return val;
    },
    set (newVal) {
      if (newVal === val) {
        return;
      }
      val = newVal;
      dep.notify();
    }
  });
}

function cb () {
  console.log('I will to updata UI');
}

class Dep {
  constructor() {
    this.subs = [];
  }

  addSub (sub) {
    this.subs.push(sub);
  }

  notify () {
    this.subs.forEach(i => i.update());
  }
}

class Watcher {
  constructor () {
    Dep.target = this;
  }

  update () {
    console.log('I will to update');
  }
}

class Vue {
  constructor (options) {
    this._data = options.data;
    new Watcher();
    observer(this._data);
    console.log('I am render', this._data.a);
    Dep.target = null;
  }
}

let vm = new Vue({
  data: {
    a: 'gg'
  }
});
