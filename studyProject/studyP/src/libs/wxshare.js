import ZZAPP from '@zz-vc/zz-open-libs/lib/libs/adapter';
import qs from 'querystring';
/**
 * @description 微信分享
 * @param {string} type friend > 分享到朋友列表 | timeline > 分享到朋友圈
 * @param {object} params
 */
class Config {
  static _isZZ = ZZAPP._isZZ;
  static _isQQ = ZZAPP._isQQ;

  static _wxShare(type = 'friend', params = {}) {
    return new Promise((resolve, reject) => {
      if(!wx)reject({errorMsg: 'wx no find: fail', data: ''});
      wx.ready(() => {
        let wxParams = {
          // 分享标题
          title: params.title || '转转图书­-让好书流转起来',
          // 分享链接，该链接域名必须与当前企业的可信域名一致
          link: params.url || location.href,
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
          title: params.title || '转转图书­-让好书流转起来', // 分享标题
          desc: params.content || '买卖闲置好书，省钱还能交朋友', // 分享描述
          // 分享链接，该链接域名必须与当前企业的可信域名一致
          link: params.url || location.href,
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
        if (/(timeline)/ig.test(type))
          wx.onMenuShareTimeline(Object.assign(wxParams, params));
        if (/(friend)/ig.test(type))
          wx.onMenuShareAppMessage(Object.assign(timelineParams, params));
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
      title: '转转图书­-让好书流转起来',
      content: '买卖闲置好书，省钱还能交朋友',
      pic: 'https://img1.zhuanstatic.com/open/zhuanzhuan/zzbook/sell-home-share.png',
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
    let miniShareUrl = Config._isZZ ?
      Config._addParamsToUrl({channel: 'appsharetowechatfriends'}, (params.miniUrl || params.url || defaultSet.url))
      : params.miniUrl || params.url || defaultSet.url;

    const miniObj = {
      "goodsInfo":
        {
          "pics": params.picPath || defaultSet.pic,
          "title": params.title || '分享一本好书',
        },
      "shareParam":
        {
          "isMiniApp": "2",
          "miniAppTitle": params.miniTitle || params.title || '分享一本好书',
          "miniAppId": "gh_c2980df66965",
          "smallPicUrl": params.miniPic || params.picPath || defaultSet.pic,
          "miniPath": `pages/webview/bridge?url=${encodeURIComponent(miniShareUrl)}`,
        }
    };

    if (Config._isZZ) {
      let cb = () =>{};
      if (params.callback && typeof params.callback === "function") {
        cb = params.callback;
      };
      if (!params.notNeedAppShareToMini) Object.assign(obj, miniObj);
      ZZAPP.setRightShareBtn(obj, cb)
    } else if (Config._isQQ) {
      ZZAPP.share(obj)
    } else {
      Config._wxShare('friend|timeline', params)
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

// 插件名集合
const pluginName = ['_wxShare', '_zzAndWxShare'];

export default {
  install(Vue, options) {
    pluginName.forEach(pluginItem => {
      // 统一安装插件
      Vue.prototype['$' + pluginItem] = Config[pluginItem];
    })
  },
}

