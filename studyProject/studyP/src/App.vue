<template>
  <div style="background: white">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <toast :event-hub="eventHub"></toast>
  </div>
</template>
<script type="text/javascript">
import { isWechat } from "./libs/wechatConfig.js"
import isWA from "./libs/isWA.js"
import Cookies from "@zz-vc/zz-open-libs/lib/libs/cookie.js"
import Vue from "vue"
import store from './store/index.js';

export default {
  store,
  data() {
    return {
      eventHub: window.eventHub,
      wechatConfigErrTimes: 0,
      wechatConfigErrMax: 3,
      appBgColor: "white",
      showTest: Vue.config.devtools,
      rulerConfig: {
        title: "提示",
        contentText: `hello`
      }
    }
  },
  methods: {
    addScript(src) {
      let script = document.createElement("script")
      script.type = "text/javascript"
      script.src = src
      document.body.appendChild(script)
    },
    wxConfig() {
      this.$http
      // .jsonp("https://app.zhuanzhuan.com/zzopen/wxcommon", {
      //     wxPublicId:(window.nativeAdapterConfig && window.nativeAdapterConfig.wxPublicId) || '',
      //     url: location.href.split('#')[0]
      //   })
        .jsonp("https://app.zhuanzhuan.com/zzopen/wxcommon/getJsTicket", {
          wxPublicId:(window.nativeAdapterConfig && window.nativeAdapterConfig.wxPublicId) || '',
          url: location.href.split('#')[0]
        })
        .then(function(response) {
          if (response.data.respCode == 0) {
            let conf = response.data.respData,
              wxconfig = {
                debug: false,
                appId: conf.appId,
                timestamp: conf.timestamp,
                nonceStr: conf.noncestr,
                signature: conf.signature,
                jsApiList: [
                  "onMenuShareTimeline",
                  "onMenuShareAppMessage",
                  "chooseImage",
                  "chooseWXPay",
                  "uploadImage",
                  "scanQRCode",
                  "getLocation",
                  "previewImage"
                ]
              }
             setTimeout(()=>{
                if (window.wx) {
                  window.wx.config(wxconfig)
                } else {
                  window.wxconfig = wxconfig
                }
             },1000) 
            
          }
        })
    },
    wxErrorLog() {
      // config信息验证失败会执行error函数
      // 如签名过期导致验证失败
      // 具体错误信息可以打开config的debug模式查看
      // 也可以在返回的res参数中查看
      // 对于SPA可以在这里更新签名
      wx.error(res => {
        console.error("微信配置失败", res)
        this.wechatConfigErrTimes++
        // 如果配置错误重新配置
        if (this.wechatConfigErrTimes <= this.wechatConfigErrMax) {
          console.info("wx config error log", res)
          this.wxConfig()
        }
      })
    },
    clearCookies() {
      let keys = document.cookie.match(/[^ =;]+(?=\=)/g)
      for (let i = keys.length; i--; )
        Cookie.set(keys[i], "", { path: "/", domain: ".58.com" })
      if (!Cookie.getPPU()) this.eventHub.$emit("toast", "注销成功")
    }
  },
  components: {
  },
   created() {
    eventHub.$on("appBgColor", res => {
      this.appBgColor = res
    })
  },
  async mounted() {
    if (!(isWA() || isWechat())) return
    // 初始化微信分享配置
    // tip 若使用除分享外的jssdk功能，需要将域名设置为 wxzhuanzhuan.58.com
    // 否则会导致域名匹配失败，无法使用api
    // this.wxConfig()
    // this.wxErrorLog()
  }
}
</script>
