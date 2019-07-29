import { login,noConcurrent } from '@zz-vc/zz-open-libs/lib/libs/decorator';
// import Axios from '@zz-vc/zz-open-libs/lib/libs/axios';
import Axios from 'axios'
Axios.defaults.withCredentials = true;
import  Vue  from  'vue' 
import  VueJsonp  from  'vue-jsonp'
Vue.use(VueJsonp)
import cookie from '@zz-vc/zz-open-libs/lib/libs/cookie';

const jsonp = (url,data)=>{
  return new Promise((resolve,reject)=>{
    Vue.jsonp(url,data).then((res1)=>{
      resolve(res1)
    }).catch((res2)=>{
      resolve(res2)
    })
  })
}

class IMAuth {
  // @noConcurrent
  static async login(){
    let imLoginRes = await jsonp("https://gr.zhuanzhuan.com/user_login",
    {
        uid: cookie.getUID(),
        source: 24, //TODO：修改这里
        pc_code: 'm',
        client_version: '1.0.0',
        token:cookie.get('tk')
    });
    if (imLoginRes.code != 200000)
      return {code: -100, errMsg: 'im login failed:'+JSON.stringify(imLoginRes)};

    return {
      code: 0,
      errMsg: 'ok'
    };
  }
  // @login
  static async requestWithLogin(options){
    let res 
    if(!/gr/.test(options.url)) {
      res = await Axios.get(options.url, options.data)
    }else {
      res = await jsonp(options.url, options.data)
    }
    // res = await Axios.get(options.url, options.data)
    //im登录态有效，直接返回请求结果
    if (res.code == 200000)
      return res;
    //im登录态失效，尝试重新登录
    let loginRes = await IMAuth.login();

    if (loginRes && loginRes['code'] != 0) //登录失败，返回
      return res;

    //重新获取请求结果
    if(!/gr/.test(options.url)) {
      return await Axios.get(options.url, options.data)
    }else {
      return await jsonp(options.url, options.data)
    }
  }
}

export default IMAuth;
