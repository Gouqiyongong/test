import Vue from 'vue';
import handleImg from '@zz-vc/zz-open-libs/lib/libs/handleImg.js';
import toRealPx from '@zz-vc/zz-open-libs/lib/libs/toRealPx.js';

class ImageUtil {
  constructor() {
    this.convertImageUrlSpecifiedSize();
  }

  //todo
  // 安装全局过滤器 过滤单张图片
  // 用法 :src="baseImg.banner | filterImg"
  private convertImageUrlSpecifiedSize(): any {
    Vue.filter('filterImg', function (value: string, width = 1000, height): string {
      height = height || width;
      if (!value) return 'data:img/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEXs7Oxc9QatAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==';
      // 图片域名中不包含58，不需要做裁剪处理
      if (!value.includes('http') && value.includes('ZZBook')) return value;
      if (value.includes('ZZBook')) return value;
      if (/^(data:image\/)/ig.test(value)) return value;
      return handleImg.handleSingle(value, toRealPx(width), toRealPx(height));
    })
  }
}

declare global {
  interface Number {
    padZero(number: number): string;
  }
}

export default new ImageUtil();
