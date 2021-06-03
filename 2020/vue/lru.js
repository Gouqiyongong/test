class LRU {
  constructor({ maxLength = 300, maxCatchTime = 3000 }) {
    this.maxLength = maxLength;
    this.maxCatchTime = maxCatchTime

    this.length = 0;
    this.catchObj = {};
  }

/*  {
    start: '',
    getNum: 1,
    value: obj
  } */

  add(key, value) {
    if (!key || !value) {
      throw Error('key value 不能为空');
      return;
    }
    if (this.catchObj[key]) {
      const obj = this.catchObj[key];
      obj.value = value;
      obj.time = Date.now();
      return;
    }
    this.clearGotCatch();
    if (this.length < this.maxLength) {
      console.log(this.length, this.maxLength);
      this.catchObj[key] = {
        value,
        start: Date.now(),
        getNum: 1
      };
      this.length++;
      return;
    }
    this.clearOneCarch();
    this.catchObj[key] = {
      value,
      start: Date.now(),
      getNum: 1
    };
    this.length++;
  }

  get (key) {
    if (!key || !this.catchObj[key]) {
      return;
    }
    const obj = this.catchObj[key];
    if (Date.now() - obj.start >= this.maxCatchTime) {
      return;
    }
    obj.getNum++;
    return obj.value;
  }

  clearOneCarch () {
    let min = Infinity,
        delKey;
    for (let key in this.catchObj) {
      const obj = this.catchObj[key];
      const hasGot = Date.now() - obj.start;
      if (hasGot >= this.maxCatchTime) {
        delete this.catchObj[key]
        this.length--;
        break;
      }
      const n = obj.getNum * 1000 + (this.maxCatchTime - hasGot);
      if (n < min) {
        min = n;
        delKey = key;
      }
    }
    delete this.catchObj[delKey];
    this.length--;
  }

  clearGotCatch () {
    for (let key in this.catchObj) {
      if (Date.now() - this.catchObj[key].start >= this.maxCatchTime) {
        if (delete this.catchObj[key]) {
          this.length--;
        } else {
        }
      }
    }
  }
}

const lru = new LRU({ maxLength: 2 });

lru.add(1, 2);
lru.add(2, 2);
console.log(Object.keys(lru.catchObj).map(k => k + '/' + lru.catchObj[k].value));
lru.add(3, 3);
lru.add(4, 4);
console.log(Object.keys(lru.catchObj).map(k => k + '/' + lru.catchObj[k].value));
