/**
 * 设置延时
 * @param {number} ms  延迟时长，单位：ms
 * @return {Promise}
 */
export default function delay(ms) {
    return new Promise((resolve, reject)=>{
      setTimeout(resolve, ms);
    });
  }