/**
 * 使用示例：<p v-exist="{data:this.productLists}"></p>
 * @type {Array}
 */
let origData = []
let length = 0
const install = (Vue) => {
  Vue.directive('exist',{
    bind(el,binding,vnode){
      origData = binding.value.data
      if(!Array.isArray(origData)){
        //如果初始化不是一个数组的话
        console.error(`${JSON.stringify(origData)}不是一个数组`)
        return;
      }
    },
    update (el, binding) {
      origData = binding.value.data
      length = binding.value.length || 0
      if(Array.isArray(origData)){
        //判断传入参数是否为一个数组
        if(origData && origData.length > length){
          el.style.display = "block"
        }else{
          el.style.display = "none"
        }
      }else{
        //传入参数不是一个数组的话，隐藏
        el.style.display = "none"
      }
    }
  })
}

export default install
