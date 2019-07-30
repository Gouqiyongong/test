<template>
  <div
    ref="refSlider"
    :class="[vertical && 'slider-vertical']"
    @click="onClickBar($event)"
    :style="{ backgroundColor: inactiveColor }"
    class="slider">
    <div
      :style="{
        [getVertical]: `${size}%`,
        backgroundColor: disable ? '#666' : activeColor,
        [getWOrH]: nowBarHeight,
        transition: steep ? '' : 'all .2s'
      }"
      class="slider-content">
      <div
        @touchstart="onTouchStart($event)"
        @touchmove="onTouchMove($event)"
        @touchend="onTouchEnd()"
        class="slider-btnwrap">
        <div class="slider-btn">{{value}}</div>
      </div>  
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Number
    },
    /* 是否禁用进度条 */
    disable: {
      default: false,
      type: Boolean
    },
    /* 进度条宽度 */
    barHeight: {
      default: 4,
      type: [ Number, String ]
    },
    /* 进度条激活颜色 */
    activeColor: {
      default: 'red',
      type: String
    },
    /* 进度条默认颜色 */
    inactiveColor: {
      default: '#e5e5e5',
      type: String
    },
    /* 是否垂直展示  垂直展示时外部容器必须有高度*/
    vertical: {
      default: false,
      type: Boolean
    },
    /* 进度条步长 */
    steep: {
      default: 15,
      type: Number
    },
    min: {
      default: 0,
      type: Number
    },
    max: {
      default: 100,
      type: Number
    }
  },
  created() {
    if(this.value) {
      this.size = this.value
    }
    /* 处理min>max */
    if(this.min > this.max) {
      const temp = this.max;
      this.max = this.min;
      this.min = temp;
    }
  },
  methods: {
    onClickBar(event) {
      if(this.disable) {
        return
      }
      const layer = event[this.layer];
      if(!layer) {
        return;
      }
      this.size = layer / this.offset() * 100
    },
    offset() {
      const { refSlider } = this.$refs;
      if(!refSlider) {
        return 0;
      }
      return this.vertical ? refSlider.offsetHeight : refSlider.offsetWidth
    },
    onTouchStart(event) {
      if(this.disable) {
        return
      }
      this.touchPos = {}
      const target = event.touches[0] || {};
      this.touchPos.startX = target.pageX;
      this.touchPos.startY = target.pageY;
      this.$emit('drag-end', this.size)
    },
    onTouchMove(event) {
      if(this.disable) {
        return
      }
      const target = event.touches[0] || {},
        currentX = target.pageX,
        currentY = target.pageY;
      const offset = this.offset();
      let size = this.size;
      if(size === this.min && currentX < this.touchPos.startX || size === this.max && currentX > this.touchPos.startX) {
        return
      }
      /* 垂直展示兼容写法 */
      if(!this.vertical) {
        size += (currentX - this.touchPos.startX) / offset * 100;
      }
      else {
        size += (currentY - this.touchPos.startY) / offset * 100;
      }
      /* 步长处理，不接近步长不处理 */
      if(this.steep) {
        size = Math.round(size / this.steep) * this.steep;
      }
      /* 兼容步长存在时不接近步长不改变size情况  避免移动被忽略 */
      if(this.size !== size) {
        this.touchPos.startX = currentX;
        this.touchPos.startY = currentY;
      }
      /* 避免超出 */
      if(size >= this.max) {
        this.size = this.max;
      } else if(size <= this.min) {
        this.size = this.min;
      } else {
        this.size = size;
      }
    },
    onTouchEnd() {
      this.$emit('drag-end', this.size)
    }
  },
  data() {
    return {
      size: 50
    }
  },
  computed: {
    getWOrH() {
      return !this.vertical ? 'height' : 'width'
    },
    getVertical() {
      return this.vertical ? 'height' : 'width'
    },
    layer() {
      return this.vertical ? 'layerY' : 'layerX'
    },
    nowBarHeight() {
      return typeof this.barHeight === 'string' ? this.barHeight : `${this.barHeight}px`
    }
  },
  watch: {
    size(newValue) {
      if(this.value !== undefined) {
        this.$emit('input', newValue)
      }
      this.$emit('change', newValue)
    }
  }
}
</script>


<style lang="less" scoped>
.slider {
  position: relative;
  margin: 0 16px 32px;
  border-radius: 999px;
  font-size: 24px;
  color: red;
  background-color: #e5e5e5;
  &-content {
    position: relative;
    background-color: #1989fa;
    border-radius: inherit;
    width: 0%;
    height: 4px;
  }
  &-vertical {
    display: inline-block;
    height: 100%;
    .slider-btnwrap {
      top: auto;
      bottom: 0;
      right: 50%;
      transform: translate3d(50%, 50%, 0)
    }
  }
  &-btnwrap {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate3d(50%, -50%, 0)
  }
  &-btn {
    display: inline-block;
    padding: 10px;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }
}

</style>
