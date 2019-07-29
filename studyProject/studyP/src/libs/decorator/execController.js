/**
 * 节流修饰器
 */
export function throttle({interval=1000}){
    return function (target, funcName, descriptor) {
      let oriFunc = descriptor.value;
      let lastExecTime = 0;
      descriptor.value = async function (...args) {
        let currentExecTime = Date.now();
        if(currentExecTime - lastExecTime > interval) {
          lastExecTime = currentExecTime;
          return oriFunc.apply(this, args);
        }
      }
    }
  }
  
  /**
   * 防抖修饰器
   */
  export function debounce({delay=300}){
    return function (target, funcName, descriptor) {
      var timer = null;
      let oriFunc = descriptor.value;
      descriptor.value = async function (...args) {
        // 清除上一个timer
        clearTimeout(timer);
        // 当最后回调时，经过delay毫秒后执行事件处理程序
        timer = setTimeout(()=>{
            oriFunc.apply(this, args);
        }, delay);
      }
    }
  }
  