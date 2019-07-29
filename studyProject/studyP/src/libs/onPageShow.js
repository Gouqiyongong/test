export default function(cb, vm){
	let timer = null;
    vm = vm || null;
	
	// 如果支持多个事件，防抖执行
	let _cb = function(){
		if(timer)clearTimeout(timer);
		timer = setTimeout(function(){
			cb.call(vm);
		}, 10);
	};

	// pageshow事件
	let pageShowTime = 0;
	window.addEventListener('pageshow', ()=>{
		pageShowTime++;
		if(pageShowTime >= 2){
			// 二次回到页面再执行
			_cb();
		}
	}, false);

  // visibilityChange事件
	let hidden, state, visibilityChange;
	if(typeof document.hidden !== 'undefined'){
		hidden = 'hidden';
		visibilityChange = 'visibilitychange';
		state = 'visibilityState';
	}else if(typeof document.mozHidden !== 'undefined') {
		hidden = 'mozHidden';
		visibilityChange = 'mozvisibilitychange';
		state = 'mozVisibilityState';
	}else if(typeof document.msHidden !== 'undefined') {
		hidden = 'msHidden';
		visibilityChange = 'msvisibilitychange';
		state = 'msVisibilityState';
	}else if(typeof document.webkitHidden !== 'undefined') {
		hidden = 'webkitHidden';
		visibilityChange = 'webkitvisibilitychange';
		state = 'webkitVisibilityState';
	}
	document.addEventListener(visibilityChange, function() {
		if(document[state] == 'visible'){
			_cb();
		}
	}, false);

	// 如果是vue组件，监听activated钩子
	if(vm && vm.$options){
		if(vm.$options.activated){
			vm.$options.activated = [_cb];
		}else if(({}).toString.call(vm.$options.activated) == '[object Array]'){
			vm.$options.activated.push(_cb);
		}
	}
}