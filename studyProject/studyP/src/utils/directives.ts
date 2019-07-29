import Vue from 'vue';

interface Style {
  width : string;
  height : string;
  background : string;
  'margin-bottom': string;
}

class Directives {
  constructor() {
    this.preText();
    this.adapterstyle();
    this.longpress();
  }
  // 实现简易墓碑元素
  private preText() {
    const render = (el,value: string) => {
      if(value && !/(null)|(undefined)|(NaN)/g.test(value))
        el.innerHTML = value;
    }

    const compile = (str: string,attr: string) => {
      try {
        let newStr : string = '';
        if(str) {
          newStr = str.replace(/(<\w+)/g, function(res){
            return res + ' ' + attr;
          });
        }
        return newStr;
      } catch(e) {
      }
    }

    const getAttr = (el) : string =>{
      let attr= '',
          node = el.attributes
      if ( node ) {
        let len = node.length;
        while (len--) {
          let test = /(data-v)/g.test(node[len].name);
          if(test) attr = node[len].name;
        }
      }
      return attr;
    }

    const addListener = (el, binding) => {
      try{
        const value = binding.value,
            attr = getAttr(el);
        const compileStr = compile(
          (typeof value === 'object')
          ? value.content
          : value,
          attr
        );
        render(el,compileStr);
      }catch(e){
      }
    }

    const replaceDom = (el,binding) =>{
      try{
        let line: number = 1;
        let defaultStyle = {
          width: '50%',
          height: '10px',
          background: '#eee',
          'margin-bottom': '10px'
        }

        if ((typeof binding.value === 'object') && (binding.value.line)){
          line = binding.value.line;
          Object.assign(defaultStyle,binding.value.style);
        }

        let template = '';
        ((style: Style = defaultStyle) => {
          let str = '';
          for(let key in style) {
            str = (str + key + ':' + style[key]) + ';';
          }
          template = `<div style="${str}"></div>`;
          if (line)
            template = template.repeat(Number(line));
        })();

        el.innerHTML = template;

      }catch(e){
      }
    }

    Vue.directive('pretext', {
      bind: replaceDom,
      update: replaceDom,
      inserted: replaceDom,
      componentUpdated: addListener
    })
  }
  // adaptation
  private adapterstyle() {
    const setStyle = (el, binding) => {
    }

    Vue.directive('adapterstyle', {
      bind: setStyle,
    })
  }

  private longpress(){
    Vue.directive('longpress', {
      bind: function (el, binding, vNode) {
        // Make sure expression provided is a function
        if (typeof binding.value !== 'function') {
          // Fetch name of component
          const compName = vNode.context.name
          // pass warning to console
          let warn = `[longpress:] provided expression '${binding.expression}' is not a function, but has to be`
          if (compName) { warn += `Found in component '${compName}' ` }

          console.warn(warn)
        }

        // Define variable
        let pressTimer = null

        // Define funtion handlers
        // Create timeout ( run function after 1s )
        let start = (e) => {

          if (e.type === 'click' && e.button !== 0) {
            return;
          }

          if (pressTimer === null) {
            pressTimer = setTimeout(() => {
              // Run function
              handler(e)
            }, 600)
          }
        }

        // Cancel Timeout
        let cancel = (e) => {
          // Check if timer has a value or not
          if (pressTimer !== null) {
            clearTimeout(pressTimer)
            pressTimer = null
          }
        }
        // Run Function
        const handler = (e) => {
          binding.value(e)
        }

        // Add Event listeners
        el.addEventListener("mousedown", start);
        el.addEventListener("touchstart", start);
        // Cancel timeouts if this events happen
        el.addEventListener("click", cancel);
        el.addEventListener("mouseout", cancel);
        el.addEventListener("touchend", cancel);
        el.addEventListener("touchcancel", cancel);
      }
    })
  }
}

export default new Directives()
