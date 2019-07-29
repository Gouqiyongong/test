export default {
  /**
   * 私信联系人过滤，过滤小程序不支持的联系人类型
   * @param {Object} contact 联系人信息 
   * @param {string} contact.uid 联系人uid
   * @return {boolean} 是否保留：true-保留，false-过滤
   */
  contactFilter(contact){
    let unsupportedUids = [ //小程序不支持的联系人
      "100",  //通知助手
      "103",  //交易消息
    ];
    
    return !unsupportedUids.includes(contact.uid);
  },
}
