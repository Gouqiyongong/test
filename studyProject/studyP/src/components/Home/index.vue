<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2 @click="jump">Essential Links</h2>
  </div>
</template>

<script>
import { JUMP_TO_PAGE } from '@zz-vc/zz-open-libs/lib/libs/constHomePage'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods:{
    jump(){
      JUMP_TO_PAGE('https://m.zhuanzhuan.com/open/ZZAntiqueTool/#/demo')
    }
  },
  mounted(){
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>

</style>
