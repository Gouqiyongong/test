/**
 * Created by leexiaosi on 16/8/4.
 */
require('./jweixin');
// import ZZAPP from './adapter'
function isWechat(){
  let ua = navigator.userAgent;
  return ua.indexOf('MicroMessenger') > -1 && window.__wxjs_environment != 'miniprogram';
}
/**
 * 微信分享到朋友圈和消息
 * @param {Object} opts - 配置
 *                        title - 标题
 *                        desc - 描述,如果是分享到朋友圈,没有描述
 *                        imgUrl - 分享的图片的地址
 *                        link - 分享的图片的地址
 */
function wechatShare(opts,success = ()=>{},cancel = ()=>{}){
  wx.ready(()=>{
    wx.onMenuShareTimeline({
      title: opts.title, // 分享标题
      link: opts.link, // 分享链接
      imgUrl: opts.imgUrl, // 分享图标
      success:success,
      cancel:cancel
    });
    wx.onMenuShareAppMessage({
      title: opts.title, // 分享标题
      desc: opts.desc, // 分享描述
      link: opts.link, // 分享链接
      imgUrl: opts.imgUrl, // 分享图标
      success:success,
      cancel:cancel
    });
  });
}
/**
 * 分享到朋友圈
 */
function wechatShareTimeline(opts){
  wx.ready(()=>{
    wx.onMenuShareTimeline({
      title: opts.title, // 分享标题
      link: opts.link, // 分享链接
      imgUrl: opts.imgUrl, // 分享图标
      success:opts.success,
      cancel:opts.cancel
    });
  });
}
/**
 * 分享给好友
 */

function wechatShareAppMessage(opts){
  wx.ready(()=>{
    wx.onMenuShareAppMessage({
      title: opts.title, // 分享标题
      desc: opts.desc, // 分享描述
      link: opts.link, // 分享链接
      imgUrl: opts.imgUrl, // 分享图标
      success:opts.success,
      cancel:opts.cancel
    });
  });
}
function wechatGetLocation(opts){
  wx.ready(()=>{
    wx.getLocation({
      success: opts.success,
      cancel: opts.cancel,
      fail: opts.fail
    })
  })
}
export {
  isWechat,
  wechatShare,
  wechatShareTimeline,
  wechatShareAppMessage,
  wechatGetLocation
}
