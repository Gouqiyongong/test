// 模拟实现一个深拷贝，并考虑对象相互引用以及 Symbol 拷贝的情况

function deepClone(obj, i, oldMark) {
  const mark = Symbol(new Date());
  let 
  let _deepClone = obj => {
    let cloneObj;
    if(typeof obj !== 'object') {
      return obj;
    }
    // 引用标识
    obj[mark] = -1;
    const type = Object.prototype.toString.call(obj);
    console.log(type)
    if(type === '[object Array]') {
      obj[mark] = i && oldMark + '/' + i || -1;
      cloneObj = [];
      obj.forEach((element, i) => {
        // 处理对象相互引用
        if(element[mark]) {
          // 处理根引用
          if(element[mark] === -1) {
            return cloneObj;
          }
          // 缺失  处理引用
          let newObj = cloneObj;
          element[mark].split('/').forEach((item, index) => {
            if(index === 0) {
              return;
            }
            newObj = newObj[item];
          })
          return newObj;
        }
        cloneObj = [].concat([_deepClone(element, i, obj[mark])])
      });
    }
    else {
      cloneObj = {};
      Object.keys(obj).forEach((item, i) => {
        // 处理对象相互引用
        if(obj[item][mark]) {
          // 处理根引用
          if(obj[item][mark] === -1) {
            return cloneObj;
          }
          // 缺失  处理引用
          let newObj = cloneObj;
          console.log(obj[item][mark])
          obj[item][mark].split('/').forEach((item, index) => {
            if(index === 0) {
              return;
            }
            newObj = newObj[item];
          })
          return newObj;
        }
        obj[mark] = i && oldMark + '/' + i || -1;
        cloneObj[item] = _deepClone(obj[item], item, obj[mark])
      })
    }
    return cloneObj;
  }
  return _deepClone(obj);
}

let obj = { a: [1], cc: Symbol(1) }
obj.a.push({ c: obj.a })
let clonObj = deepClone(obj)
console.log(JSON.stringify(clonObj))