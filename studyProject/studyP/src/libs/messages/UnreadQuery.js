import SingletonPolling from '../SingletonPolling';
import offlineManager from './offlineManager';
import UserPick from '../UserPick';
import messageConfig from './config';


import IMAuth from "@/libs/IMAuth";
import {errSafe} from '@/libs/withErrToast.js'
import {deepClone,deepEqual} from '@/libs/util.js';
import cookie from '@zz-vc/zz-open-libs/lib/libs/cookie';
import delay from './delay';

class UnreadQuery {
  _options = {
    interval: 10000, //轮询间隔，单位：ms
    listener: null,  //回调函数
    contactFilter(contact){ //私信联系人过滤
      return messageConfig.contactFilter(contact); //过滤小程序不支持的联系人
    }
  };
  _pollingJob = null; //轮询器，用于定时查询留言和订单消息未读数
  _pickJob = null; //伪长连接，用于实时监听新增未读私信数
  _lastRes = { //缓存上次查询结果，用于对比，以判断是否需要触发回调
    msgs: {
      total: 0,
      contacts: [],
    },
    comments: {
      total: 0,
    },
    sysMsgs: {
      total: 0,
    },
    total: 0,
  };

  constructor(options){
    Object.assign(this._options, options);

    this._pollingJob = new SingletonPolling({
      interval: this._options.interval,
      job: ()=>{return this._poll();},
    });
    this._pickJob = new UserPick({
      listener: this.onUserPick,
    });
  }

  /**
   * 查询未读私信数，首次查询时使用，后续通过user_pick实时监听增量变化
   * @return {Promise<{total: *, contacts: *}>}
   * @private
   */
  @errSafe
  async _queryInitMsgs(){

    let unreadRes = await IMAuth.requestWithLogin({
      url: 'https://gr.zhuanzhuan.com/zzmsg_get_unread_count',
      data: {
        uid: cookie.getUID(), //uid在_query函数中保证
        source: 24, //TODO
      },
    });

    if (unreadRes.code != '200000')
      return;

    let contacts = unreadRes.protocol_content.unread_info.map(item=>({
      uid: item.contact_uid,
      unreadCount: parseInt(item.msg_count),
    })).filter(this._options.contactFilter);
    let total = contacts.reduce((sum,contact)=>sum+contact.unreadCount, 0);

    this._updateRes({
      msgs: {
        total,
        contacts,
      }
    });
  }

  onUserPick = (pickRes)=>{
    //有新私信
    if (pickRes.cmd==="msg" && pickRes.sub_cmd==="tmp_notify") {
      let fromUid = pickRes.protocol_content.from_uid;
      let msgs = deepClone(this._lastRes.msgs);
      ++msgs.total;

      let hit = false;
      for (let contact of msgs.contacts) {
        if (contact.uid === fromUid) {
          hit = true;
          ++contact.unreadCount;
          break;
        }
      }
      if (!hit) {
        msgs.contacts = [{
          uid: fromUid,
          unreadCount: 1,
        }, ...msgs.contacts];
      }

      this._updateRes({msgs});
    }
  }

  /**
   * 查询未读留言数
   * @return {Promise<{total: number}>}
   * @private
   */
  @errSafe
  async _queryComments(){
    let unreadRes = await IMAuth.requestWithLogin({
      url: "https://app.zhuanzhuan.com/zz/transfer/getNewUnreadCommentsCount",
      data: {
      },
      method: "POST"
    });

    if (!(unreadRes.respCode==0 && unreadRes.respData))
      return;

    return {
      total: parseInt(unreadRes.respData.count)
    }
  }

  /**
   * 查询未读系统消息数（订单消息）
   * @return {Promise<{total: number}>}
   * @private
   */
  @errSafe
  async _querySysMsgs(){
    await offlineManager.pull();

    return {
      total: offlineManager.getCount(),
    }
  }

  @errSafe
  async _poll(){
    if (!ZZLogin.zzUserInfo.uid) //新用户若未授权，直接返回，此处不主动触发授权行为
      return;

    let [fetchComments, fetchSysMsgs] = [this._queryComments(), this._querySysMsgs()]; //请求并行发出

    this._updateRes({
      comments: await fetchComments,
      sysMsgs: await fetchSysMsgs,
    });
  }

  _updateRes(info){
    let res = Object.assign({}, this._lastRes, info);
    res.total = res.msgs.total + res.comments.total + res.sysMsgs.total;

    if (!deepEqual(res, this._lastRes))
      this._options.listener && this._options.listener(res);

    this._lastRes = res;
  }

  /**
   * 开始轮询
   */
  start(){
    this._queryInitMsgs();
    this._pollingJob.start();
    this._pickJob.start();
  }

  /**
   * 结束轮询
   */
  stop(){
    this._pollingJob.stop();
    this._pickJob.stop();
  }
}

export default UnreadQuery;
