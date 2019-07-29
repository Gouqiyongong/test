import ZZAPP from '@zz-vc/zz-open-libs/lib/libs/adapter'

export default function requireMobile(){
  return function (target, funcName, descriptor) {
    let oriFunc = descriptor.value;

    descriptor.value = async function (...args) {
      
     let checkRes = await this.$http.get('/zzopen/mainminiapp/isuserbind',{});
     let data = checkRes.data;
     let isBound = data.respCode == 0 && data.respData.isBind;
      if(!isBound){
        ZZAPP.bindPhone();
        return;
      }
      return oriFunc.apply(this, args); //绑定成功才执行原函数
    }
  }
}
