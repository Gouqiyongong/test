import { legoInit,legoPerfVue } from '@zz/lego';
legoInit();
import Vue from 'vue'
import App from './App'
import router, { routes } from './router'
import VueTouch from 'vue-touch'
import Log from './libs/leStatic'
import handleImg from '@zz-vc/zz-open-libs/lib/libs/handleImg'
import Axios from '@zz-vc/zz-open-libs/lib/libs/axios'
import flexible from '@zz-vc/zz-open-libs/lib/libs/flexible'
import VueLazyload from '@zz-vc/vue-lazyload';
import Cookie from '@zz-vc/zz-open-libs/lib/libs/cookie'
import { Toast } from '@zz-vc/zz-open-ui'
import getQuery from '@zz-vc/zz-open-libs/lib/libs/getQuery.js'
import enterPage from '@zz-vc/zz-open-libs/lib/libs/enterPage.js'
import Component from 'vue-class-component';
import Raven from '@/libs/raven.js'
import { Dialog } from '@zz-common/zz-ui';
import refreshPage from '@/libs/refreshPage.js';
import Model from '@zz-vc/zz-open-libs/lib/model/Model'
// Model类全局唯一配置，v0.3.15
Model.globalConfig = {
    // fetch前执行，入参为fetch参数和model实例，返回值[可以为promise类型]为新fetch参数，使用场景：对某些类型fetch入参统一做二次格式化
    beforeFetch: [function (params, instance){
        let _params = params;
        // 运维需求，鉴于安全考虑，对args式（形如fetch({arg:{productId:this.infoId}})）传参采用post方式
        if(_params && ({}).toString.call(_params.arg) === '[object Object]'){
            try{
                instance.options.type = 'post';
                _params.arg = JSON.stringify(_params.arg);
            }catch(e){}
        }
        return _params;
    }],
    // fetch后执行，入参为fetch结果和model实例，返回值[可以为promise类型]为新fetch结果，使用场景：对某些类型返回值或错误做统一处理
    afterFetch: [function (res, instance){
        try{
            // 文玩多账号登录需求定义返回-11代表子账号权限失效，此时应该去掉cookie中的授权账号标识role，刷新页面
            if(res.error && res.error.errorCode == -11){
                let expires = (new Date(Date.now() - 10000000));
                document.cookie="role=' ';domain=.zhuanzhuan.com;path=/;expires=" + expires.toUTCString();
                alert('账号权限已被收回');
                refreshPage();
            }
        }catch(e){}
        return res;
    }]
}

require('@/utils/directives');
require('@/filters/ImageUtil');

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate',
]);
if (process.env.NODE_ENV !== 'production') {
    require('vconsole');
} else {
    try {
        Raven().setConfig('https://ace8d183f06340aaa8c821524bb3f862@sentry.zhuanzhuan.com/369')
    } catch (error) {
    }
    // 如果是线上版本清空所有log
    console.log = function() {};
}
Axios.defaults.withCredentials = true;
Vue.prototype.$http = Axios;
Vue.config.productionTip = false;

class Utils {
    constructor() {
        this.launch();
        this.init();
    }

    guid() {
        return 'xxxxxxxxxx'.replace(/[x]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

    init() {
        let domain = location.host.includes('58') ? '.58.com' : '.zhuanzhuan.com';

        if (navigator.userAgent.indexOf('MicroMessenger') > -1) {
            if(getQuery('tk')){
                Cookie.set('tk',decodeURIComponent(getQuery('tk')), { expires: 1000, path: '/', domain });
            }else {
                let cookieid = Cookie.get('tk');
                if(!cookieid){
                    cookieid = 'wx-'+this.guid();
                    Cookie.set('tk',cookieid, { expires: 1000, path: '/', domain });
                }
            }
        };
          if(getQuery('channelid')) Cookie.set('channelid', getQuery('channelid') , { expires: 7, path: '/', domain })
          if(getQuery('fromChannel')) Cookie.set('fromChannel', getQuery('fromChannel') , { expires: 7, path: '/', domain })
          if(getQuery('fromShare')) Cookie.set('fromShare', getQuery('fromShare') , { expires: 7, path: '/', domain })

    }
    launch() {
        // meta标签和rem设置
        flexible();
        // 初始化插件
        this.initPlug();
        // 事件派发中心，不设计state改变的通知建议使用eventHub
        Vue.prototype.publicEventHub = window.eventHub = new Vue();
        Vue.prototype.$getQuery = getQuery
        Vue.prototype.$enterPage = enterPage
        Vue.prototype.$handleImg = handleImg

        // 修正hash
        this.correctHashRoute();
        // 挂载vue
        this.vm();
    };

    localStorageSpace(){
        let allStrings = '';
        for(let key in window.localStorage){
            if(window.localStorage.hasOwnProperty(key)){
                    allStrings += window.localStorage[key];
            }
        }
        return allStrings.length/1024;
    };

    // 挂载Vue
    vm() {
        new Vue({
            el: '#app',
            router,
            components: {
                    app: App
            },
            render: createEle => createEle('app')
        });
    };

    // 安装插件
    initPlug() {
        VueTouch.config.swipe = {
            direction: 'horizontal'
        };
        Vue.use(VueTouch);
        // 乐高统计
        Vue.use(Log);
        // 加载Toast组件
        Vue.use(Toast);
        // 使用懒加载
        Vue.use(VueLazyload, {
          preLoad:1.3,
          attempt:1,
          listenEvents: ['scroll','wheel','touchmove'],
          error: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
          loading: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
          lazyComponent:true,
          observer:true,
          // optional
          observerOptions: {
            rootMargin: '0px',
            threshold: 0.1
          }
        });

        Vue.use(legoPerfVue);
        Vue.use(Dialog);
    };
    // 修正路由
    correctHashRoute() {
        let url = location.href,
            queryArr = [],
            queryStr = '',
            splitQuery = str => str.substring(1).split('&'),
            reg = /^(https?\:\/\/[\w\.\/]+)(\?[^#]+)?(#[^\?&]+)?(.+)?$/,
            res = reg.exec(url);
        if (!res || !res[3]) return;
        if (res[4]) queryArr = queryArr.concat(splitQuery(res[4]));
        if (res[2]) queryArr = queryArr.concat(splitQuery(res[2]));
        if (!queryArr.length) return;
        queryArr = [...new Set(queryArr)];
        queryStr = '?' + queryArr.join('&');
        location.hash = res[3] + queryStr;
    }

};

new Utils();
