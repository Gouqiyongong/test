import adapter from '@zz-vc/zz-open-libs/lib/libs/adapter';
export default function(){
	console.log(window.native.client, 'window.native.client')
	if(window.native.client == 'wechat'){
		// 微信端close调用的是wx.closeWindow，但是close需求场景常常是回退到上一页
		window.history.go(-1);
	}else{
		adapter.close();
	}
}