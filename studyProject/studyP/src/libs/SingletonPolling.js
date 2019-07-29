import delay from "./delay.js";
import {errSafe} from './withErrToast.js';

/**
 * 单例轮询
 * 使用场景：
 * 1. 需要轮询，如定时检查是否有新的未读消息、倒计时等
 * 2. 需要启动/暂停，如页面onHide时暂停轮询，onShow时恢复轮询
 * 功能：
 * 1. 自动轮询 & 支持启动/暂停
 * 2. 多次启动/暂停后，依然保持只有一个轮询实例，避免出现timer未及时清理导致的多重轮询
 */
class SingletonPolling {
  _interval = 10000;
  _job = null;

  _runningConfig = {}; //用于结束上次轮询，避免并发

  /**
   * 构造函数
   * @param {number} interval 轮询间隔，单位：ms
   * @param {Function} job  任务函数，返回false/Promise<false>可以提前结束轮询
   */
  constructor({interval, job}){
    this._interval = interval;
    this._job = job;
  }

  /**
   * 开始/恢复轮询
   */
  start(){
    if (!this._job)
      return this;

    this.stop(); //免并发

    let roundId = Date.now();
    this._runningConfig[roundId] = true;
    this._run(roundId);
    return this;
  }

  /**
   * 结束/暂停轮询
   */
  stop(){
    for (let roundId in this._runningConfig)
      delete this._runningConfig[roundId];
    return this;
  }

  @errSafe //捕获异常，打印报错信息
  async _run(roundId){
    /*
    之所以使用roundId控制启动/暂停而不直接使用clearTimeout，是因为
      1. 若在setTimeout期间执行任务，则有可能出现任务耗时过长，导致出现本次任务尚未结束、下次timer即已开始的错位现象
      2. 若先后进行任务执行和设置延迟，则有可能出现在执行任务期间、setTimeout未开始/刚结束，被要求暂停，此时clearTimeout起不到任何效果，导致暂停失败
     */
    while (this._runningConfig[roundId]) {
      let res = await this._job({isJobAborted: ()=>!this._runningConfig[roundId]});
      if (res === false)
        break;

      if (this._interval >= 0)
        await delay(this._interval);
    }
  }
}

export default SingletonPolling;
