<template>
  <div class="hello">
    <SharePanel :defaultImages="defaultImages" :defaultContent="defaultContent" :destUrl="destUrl"></SharePanel>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
const SharePanel = require('./SharePanel/Index')
@Component({
  components:{
    SharePanel
  }
})
export default class Demo extends Vue{
  private defaultContent:string = 'awdfasdfajsdklfjaslkdfjalsdjfalsjdflasjdlfajsldfjaslkdfjasldfjalksdjflkasjdfklasdj'
  private placeHolder:string = ''
  private defaultImages:any = [
    'https://pic2.zhuanstatic.com/zhuanzh/n_v29949e73284de4a45b9cfc6dec4dcd64f.jpg',
    ]
    private destUrl: string = 'https://m.zhuanzhuan.com/open/ZZAntiqueToolBusiness/index.html?infoId=1108633654863921154#/demo'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>

</style>

