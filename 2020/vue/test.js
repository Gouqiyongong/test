class StackClass {
  constructor () {
    this.stack = [];
    this.maxLength = Math.pow(2,32)-1;
    this.min = Infinity;
  }

  push(k) {
    if (k === undefined) {
      return;
    }
    if (this.len === this.maxLength) {
      throw new Error('堆栈溢出');
    }
    this.stack.push(k);
    if (k < this.min) {
      this.min = k;
    }
  }

  pop () {
    if (this.isEmpty) {
      throw new Error('堆栈为空，不可出栈');
    }
    const popItem = this.stack.pop();
    if (popItem === this.min) {
      setTimeout (() => {
        this.min = Infinity;
        this._getMin();
      });
    }
    return popItem;
  }

  _getMin () {
    this.stack.forEach(i => {
      if (i < this.min) {
        this.min = i;
      }
    });
  }

  this.getMin () {
    if (isFinite(this.min)) {
      this._getMin();
    }
    return min;
  }

  clear () {
    this.stack.length = 0;
  }

  top () {
    return this.stack[this.len - 1];
  }

  get len () {
    return this.stack.length;
  }

  get isEmpty () {
    return !!this.len;
  }
}