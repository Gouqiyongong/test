import ZZAPP from '@zz-vc/zz-open-libs/lib/libs/adapter';
import isZZ from './isZhuanzhuan.js';
import qs from 'querystring';
/**
 * @description 微信分享
 * @param {string} type friend > 分享到朋友列表 | timeline > 分享到朋友圈
 * @param {object} params
 */
class Config {

  static _wxShare(type = 'friend', params = {}) {
    return new Promise((resolve, reject) => {
      if(!wx)reject({errorMsg: 'wx no find: fail', data: ''});
      wx.ready(() => {
        let link = params.url || location.href,wxLink,timeLineLink;
        if(link.indexOf('?') == -1){
          wxLink = link.slice(0,link.indexOf('#'))+'?fromShare=friend'+link.slice(link.indexOf('#'));
          timeLineLink = link.slice(0,link.indexOf('#'))+'?fromShare=friendField'+link.slice(link.indexOf('#'))
        }else{
          wxLink = link.slice(0,link.indexOf('#'))+'&fromShare=friend'+link.slice(link.indexOf('#'));
          timeLineLink = link.slice(0,link.indexOf('#'))+'&fromShare=friendField'+link.slice(link.indexOf('#'))
        }

        let wxParams = {
            // 分享标题
            title: params.title || '这么好的宝贝，不推荐给你，我心里过意不去',
            desc: params.content || '这么好的宝贝，不推荐给你，我心里过意不去', // 分享描述
            // 分享链接，该链接域名必须与当前企业的可信域名一致
            link: wxLink,
            // 分享图标
            imgUrl: params.picPath || 'https://img1.zhuanstatic.com/open/zhuanzhuan/ZZBook/share.png',
            success: res => {
              if(params.callback){
                params.callback(res)
              }
              resolve()
            },
            cancel: reject
          },
          timelineParams = {
            title: params.title || '这么好的宝贝，不推荐给你，我心里过意不去', // 分享标题
            desc: params.content || '这么好的宝贝，不推荐给你，我心里过意不去', // 分享描述
            // 分享链接，该链接域名必须与当前企业的可信域名一致
            link: timeLineLink,
            imgUrl: params.picPath || 'https://img1.zhuanstatic.com/open/zhuanzhuan/ZZBook/share.png', // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: res => {
              if(params.callback){
                params.callback(res)
              }
              resolve()
            },
            cancel: reject
          }
        if (/(friend)/ig.test(type)){
          wx.onMenuShareAppMessage(Object.assign(wxParams, params))
        }
        if (/(timeline)/ig.test(type)){
          wx.onMenuShareTimeline(Object.assign(timelineParams, params))
        }


        if (window.__wxjs_environment === 'miniprogram') {
          ZZAPP.share({
            title: params.waTitle || params.title || '老铁，认识你这么久，突然想送你个礼物',
            waImg: params.waImg || params.picPath || 'http://img1.zhuanstatic.com/open/zhuanzhuan/zzwa/main/book/shareSendBook.jpg',
            url: params.url || location.href,
          }, (res) => {
            if(params.callback){
              params.callback(res)
            }
            resolve();
          })
        }
      })
    })
  };

  static _zzAndWxShare(params) {
    // 默认配置
    const defaultSet = {
      title: '这么好的宝贝，不推荐给你，我心里过意不去',
      content: '这么好的宝贝，不推荐给你，我心里过意不去',
      pic: 'https://img1.zhuanstatic.com/open/zhuanzhuan/zzwa/runningbear/detail/default.png',
      url: location.href,
    };
    // 普通分享配置
    const obj = {
      text: '分享',
      title: params.title || defaultSet.title,
      content: params.content || defaultSet.content,
      picPath: params.picPath || defaultSet.pic,
      url: params.url || defaultSet.url,
      logParam: "zhuanzhuan",
      panelType: 'onlyWeixin',
      shareType: "common",
      buttonType: "icon",
      needLogin: 0,
    };
    // 配置小程序 默认app分享到小程序
    // 如果不想分享到小程序可以设置 notNeedAppShareToMini = true
    let miniShareUrl = isZZ ?
      Config._addParamsToUrl({channel: 'appsharetowechatfriends'}, (params.miniUrl || params.url || defaultSet.url))
      : params.miniUrl || params.url || defaultSet.url;

    const miniObj = {
      "goodsInfo":
        {
          "pics": params.picPath || defaultSet.pic,
          "title": params.title || '分享一件好物',
        },
      // "shareParam":
      //   {
      //     "isMiniApp": "2",
      //     "miniAppTitle": params.miniTitle || params.title || '分享一件好物',
      //     "miniAppId": "gh_c2980df66965",
      //     "smallPicUrl": params.miniPic || params.picPath || defaultSet.pic,
      //     "miniPath": `pages/webview/bridge?url=${encodeURIComponent(miniShareUrl)}`,
      //   }
    };
    if (isZZ) {
      let cb = () =>{};
      if (params.callback && typeof params.callback === "function") {
        cb = params.callback;
      };
      if (!params.notNeedAppShareToMini) Object.assign(obj, miniObj);
      ZZAPP.setRightShareBtn(obj, cb)
    } else if (window.navigator.userAgent.toUpperCase().indexOf('QQ') > 0) {
      ZZAPP.share(obj)
    } else {//微信或小程序
      ZZAPP.asyncIn('wa',()=>{
        ZZAPP.share({
          title: params.miniTitle || params.title || '分享一件好物',
          waImg: params.picPath || defaultSet.pic,
          url: miniShareUrl,
        })
      },(res)=>{
        Config._wxShare('friend|timeline', params)
      })
    }
  }
  static _addParamsToUrl(params={},url) {
    let stringifyParamas = qs.stringify(params);
    url = !url.includes('?')
      ? url + '?' + stringifyParamas
      : url.replace('?',('?' + stringifyParamas + '&'));
    return url;
  }
}

export default {
  config:Config['_zzAndWxShare'],
  install(Vue, options) {
    Vue.prototype['$share'] = Config['_zzAndWxShare'];
  },
}

