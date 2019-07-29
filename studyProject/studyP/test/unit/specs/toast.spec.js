import { shallowMount  } from '@vue/test-utils';
import ToastTip from '../../../src/components/ToastTip.vue';
import Vue from 'vue';

describe('ToastTip', () => {
  // 模拟toast展示
  it('当调用了toast方法，页面展示toast输入的字段', (done) => {
    const msg = '我是一个toast';
    const eventHub = new Vue()
    const wrapper = shallowMount (ToastTip,{
      propsData: {
        eventHub
      }
    });
    // 调用toast方法；
    wrapper.vm.eventHub.$emit('toast',msg);
    // dom更新完之后判断是否页面展示了输入的字段
    wrapper.vm.$nextTick(()=>{
      const wrapP = wrapper.find('p');
      // 判断字段
      expect(wrapP.text()).toBe(msg);
      // 判断是否展示
      expect(wrapper.vm.isShow).toBe(true);
      done();
    })
  });

  it('当toast超过两秒后消失', (done) => {
    const msg = '我是一个toast';
    const wrapper = shallowMount (ToastTip,{
      propsData: {
        eventHub: new Vue(),
        duration: 2000
      }
    });
    wrapper.vm.toast(msg);
    setTimeout(()=>{
      expect(wrapper.vm.isShow).toBe(false);
      done();
    },2100);
  })
});