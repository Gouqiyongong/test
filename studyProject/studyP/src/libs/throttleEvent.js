const throttle = function(func, delay) {     
    var timer = null;     
    var startTime = Date.now();     
    return function() {             
        var curTime = Date.now();             
        var remaining = delay - (curTime - startTime);             
        var context = this;             
        var args = arguments;             
        clearTimeout(timer);              
        if (remaining <= 0) {                    
            func.apply(context, args);                    
            startTime = Date.now();              
        } else {                    
            timer = setTimeout(func, remaining);              
        }      
    }
}
let eventHandler
export const bindEvent = function(dom,eventName,callback,throttleTime = 100){
    eventHandler = throttle(callback,throttleTime)
    dom.addEventListener(eventName,eventHandler,{passive: true})
    return eventHandler
}
export const unbindEvent = function(dom,eventName,eventHandler){
    if(eventHandler){
        dom.removeEventListener(eventName,eventHandler,{passive: true})
        eventHandler = null
    }
}
