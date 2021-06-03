/*
 * @Author: your name
 * @Date: 2020-12-31 16:48:23
 * @LastEditTime: 2020-12-31 17:45:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ZZOpenBusiness\test.js
 */
function sleep (time = 1000) {
  return () => {
    return new Promise(res => {
      setTimeout(res, time)
    })
  }
}

class Action {
  constructor (config = { maxLine: 2 }) {
    this.config = config
    this.queue = []
    this.activeNum = 0
    this.startTime = Date.now()
  }

  start (fn) {
    this.queue.push(fn)
    this.startALl()
  }

  startALl () {
    if (!this.queue.length) return
    for (; this.activeNum < this.config.maxLine;) {
      this.startOne(this.queue.shift())
      this.activeNum++
      if (!this.queue.length) break
    }
  }

  async startOne (fn) {
    await fn()
    if (!this.queue.length) {
      this.activeNum--
      return
    }
    this.startOne(this.queue.shift())
  }
}

const action = new Action()

;[1000, 2000, 3000, 1000, 2000].forEach(i => action.start(sleep(i)))
