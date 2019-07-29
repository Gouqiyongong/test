import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';
import Vue from 'vue';
import Cookie from '@zz-vc/zz-open-libs/lib/libs/cookie'
import dateFormat from './dateFormat'
export default function(type = 'react') {
  const date = dateFormat(new Date(), 'yyyy-mm-dd');
  const UA = navigator.userAgent;
  return {
    /**
     * @function
     * @name [Raven]setConfig - 前端错误异常上报安装
     * @desc 前端配置错误异常上报及主动上报函数封装
     * @param {string} url 申请的异常上报系统地址
     * @param {object} cfg 配置
     * @example
     * import  Raven  from '@/libs/raven';
     * 
     * // 安装错误异常上报系统
     * Raven().setConfig(url,{});
     * 
     */
    setConfig: function(url, cfg = {}) {
      Raven.config(url).addPlugin(RavenVue, Vue).install(Object.assign({}, {
        // 环境变量
        environment: process.env.NODE_ENV,
        // 只有 production 环境才上报错误
        breadcrumbCallback: function() {
          //对数据执行某些操作
          return process.env.NODE_ENV === 'production';
        },
        // 上报白名单 URL，只上报当前白名单 URL 错误（支持正则）
        whitelistUrls: [
          /zhuanzhuan\.com/,
          /58\.com/
        ],
        // 忽略上报错误（支持正则）
        ignoreErrors: [
          /webpack/ig,
          /WeixinJSBridge is not defined/gi,
        ]
      }, cfg));
    
      Raven.setExtraContext({
        cookie: Cookie.get(),
        UA,
      });
      Raven.setTagsContext({
        t: Cookie.get('zz_t') || Cookie.get('t') || '',
        route: (location.hash && location.hash.replace(/(#)([^\?]*)(\?.*)*/g, '$2')) || '',
        env: process.env.NODE_ENV || '未知',
        date,
        uid: Cookie.getUID() || '',
      });
    },
    /**
     * @function
     * @name [Raven]captureException - 主动上报异常
     * @desc 主动上报前端异常错误
     * @param {string} err 错误信息
     * @param {number} [type=1] 错误类型, 1: 组件级错误，2: 页面级错误， 3: 接口错误，4: 服务器错误，5: 请求失败
     * @param {object} [opts={}] 合并发布对象，例如 {tags: ..., extra: ...}
     * @example
     * import  Raven  from '@libs/raven';
     * 
     * // 安装错误异常上报系统
     * Raven().captureException('有错误', 1, {
     *  tags: {
     *    test: 'test'
     *  }
     * });
     * 
     */
    captureException: (err, type = 1, opts = {}) => {
      let errObj = null;
      if (err instanceof Error) {
        errObj = err;
      } else if (err instanceof Object){
        if (err.respMsg || err.errorMsg || err.errMsg || err.respData || err.respCode) {
          errObj = new Error(err.respMsg || err.errorMsg || err.errMsg || '网络异常');
        } else {
          errObj = new Error(JSON.stringify(err));
        }
      } else if (typeof err === 'string') {
        errObj = new Error(err);
      }
      let errorType = type;
      switch(type) {
        case 1:
          errorType = '组件级错误';
          break;
        case 2:
          errorType = '页面级错误';
          break;
        case 3:
          errorType = '接口错误';
          break;
        case 4:
          errorType = '服务器错误';
          break;
        case 5:
          errorType = '请求失败';
          break;
        default:
          errorType = '其他';
          break;
      }
      const tagsDefault = {
        errorType,
        errInfo: errObj && errObj.message,
        isSendEmail: 1,
        t: Cookie.get('zz_t') || Cookie.get('t') || '',
        uid: Cookie.get('uid') || '',
        route: (location.hash && location.hash.replace(/(#)([^\?]*)(\?.*)*/g, '$2')) || '',
      };
      // 接口错误时，状态码大于10001不发邮件
      const tags = opts.tags;
      if (tags.respCode && tags.respCode >= 10001) {
        tagsDefault.isSendEmail = 0;
      }
      
      Raven.captureException(errObj, {
        tags: Object.assign(tagsDefault, opts.tags || {}),
        extra: Object.assign({
          cookie: Cookie.get()
        }, opts.extra || {}),
        fingerprint: [date, process.env.NODE_ENV, errorType, errObj && errObj.message]
      });
    }
  };
};