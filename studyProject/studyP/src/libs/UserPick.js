import SingletonPolling from './SingletonPolling.js';
import IMAuth from './IMAuth';
import cookie from '@zz-vc/zz-open-libs/lib/libs/cookie';
import delay from './delay';

/**
 * 服务端主动推送
 * 服务端主动向前端推送内容，采用伪长连接的形式实现：
 * 1. 前端向后端发送user_pick请求，后端接收后扣住不返回；
 * 2. 直到服务端需要向前端发送内容或超过一定时限时，再将内容作为user_pick响应结果予以返回；
 * 3. 前端收到user_pick返回内容后，立刻发出下一个user_pick，以此保持长连接。
 * 这样，基本可以实现服务端主动、实时向前端发送消息的效果
 */
class UserPick {
  _listener = null;

  /**
   * 构造函数
   * @param {Function} listener 监听函数，入参为user_pick接口返回内容
   */
  constructor({listener}){
    this._listener = listener;
  }

  /**
   * 开始长连接
   */
  start(){
    _PickTask.addListener(this._listener);
  }

  /**
   * 结束长连接
   */
  stop(){
    _PickTask.removeListener(this._listener);
  }
}

/**
 * user_pick执行器，主要用于管理并发时序
 * 多个页面可能同时发起多个user_pick，但实际执行时只应存在一个user_pick，否则服务端推送内容只会被某个页面接收，其它页面则无法获取
 */
class _PickTask {
  static _listeners = []; //各个监听函数
  static _polling = null; //长连接实例

  static addListener(listener){
    if (!listener)
      return;

    _PickTask._listeners.push(listener);

    if (!_PickTask._polling){
      _PickTask._polling = new SingletonPolling({
        interval: -1, //user_pick采用伪长连接的方式实现，时间间隔由后端控制，前端无需设置延时
        job: _PickTask._job
      })
    }

    _PickTask._polling.start();
  }
  static removeListener(listener){
    _PickTask._listeners = _PickTask._listeners.filter(item=>item!=listener);

    if (_PickTask._listeners.length === 0)
      _PickTask._polling.stop();
  }
  static async _job(){
    if (!cookie.getPPU()) //若未登录，则手动设置延时后重试，不在此处触发授权
      return await delay(10000);

    let pickRes = await IMAuth.requestWithLogin({ //发起伪长连接请求
      url: 'https://gr.zhuanzhuan.com/user_pick',
      data: {
        uid: cookie.getUID(),
        source: 24
      }
    });

    for (let listener of _PickTask._listeners){
      try {
        listener && listener(pickRes);
      } catch (e) {
        console.error(e);
      }
    }
  }
}

export default UserPick;
