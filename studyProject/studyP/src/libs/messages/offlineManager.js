/*
   目前系统消息依然采取离线消息的形式，由前端自行管理
   离线消息被查询过一次，服务端就会将其清除，不再返回，因而需要前端自行存储历史查询结果，自行管理未读数
   暂不支持分端处理，一端拉取过的系统消息，在另一端就不再返回 e.g.小程序中拉取了系统消息，APP中再拉时就会返回空数组
    */
import IMAuth from "@/libs/IMAuth";
import {errSafe} from '@/libs/withErrToast.js'
import {deepClone} from '@/libs/util.js';
import cookie from '@zz-vc/zz-open-libs/lib/libs/cookie';
class OfflineManager {
  _offlineMsgs = [];

  /**
   * 拉取新的离线消息
   * @return {Promise<void>}
   */
  @errSafe
  async pull(){
    let offlineSysRes = await IMAuth.requestWithLogin({
      url: 'https://gr.zhuanzhuan.com/zzmsg_get_pass_sys_msg',
      data: {
        uid: cookie.getUID(),
        source: 24,//TODO修改t
        msg_count: 100,
        start_timestamp: 0,
      }
    });
    if (offlineSysRes.code != '200000')
      return;

    let msgs = offlineSysRes.protocol_content.msg_data;
    this._offlineMsgs.push(...msgs);
  }

  /**
   * 标已读
   * @param {Function} msgFilter 过滤函数，符合条件的消息将按已读处理
   */
  markRead(msgFilter){
    this._offlineMsgs = this._offlineMsgs.filter(msg=>!msgFilter(msg));
  }

  /**
   * 获取离线消息数量
   * @return {number}
   */
  getCount(){
    return this._offlineMsgs.length;
  }

  /**
   * 获取当前所有离线消息
   * @return {Array<msg>}
   */
  getMsgs(){
    return deepClone(this._offlineMsgs);
  }
}

export default new OfflineManager();
