class Events {
  constructor () {
    this._sub = {};
  }
  $on (type, fn, options) {
    if (!type || typeof fn !== 'function') {
      return this;
    }
    const that = this;
    (this._sub[type] || (this._sub[type] = [])).push(fn);
    return this;
  }

  $emit (type) {
    if (!type || !this._sub[type]) {
      return this;
    }
    const that = this;
    this._sub[type].forEach(fn => fn());
    return this;
  }

  $off (type, fn) {
    if (!type || !this._sub[type]) {
      return this;
    }
    if (!fn) {
      this._sub[type] = [];
      return this;
    }
    if (typeof fn !== 'function') {
      return this;
    }
    const index = this._sub[type].indexOf(fn);
    if (index > -1) {
      this._sub[type].splice(index, 1);
    }
    return this;
  }
}

export default new Events();

const eventhub = new Events();
eventhub.$on('ll', () => {function(){}()});
this.a = a.bind(this);
eventhub.$on('ll', function(){}.bind());
