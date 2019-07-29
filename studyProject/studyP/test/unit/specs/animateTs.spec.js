import { shallowMount,createLocalVue  } from '@vue/test-utils'
import AnimateCss from '../../../src/components/AnimateCss/AnimateCss.vue'
import { Config,pluginName } from '../../../src/utils/plugins';
import Log from '../../../src/libs/leStatic';

import { modules } from '../../../src/store';
import Vuex from 'vuex';

import VueRouter from 'vue-router';

// 创建的一个 Vue 的本地拷贝 ,在这份拷贝上安装插件可以防止原始的 Vue 被污染。
const localVue = createLocalVue();
const router = new VueRouter()
localVue.use(VueRouter);

pluginName.forEach(pluginItem=>{
  // 统一安装插件
  localVue.prototype['$'+pluginItem] = Config[pluginItem];
});

localVue.use(Log);


// 在本地 Vue 安装Vuex
localVue.use(Vuex);
// 创建Vue store实例
let store = new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production'
});

describe('AnimateCss', () => {
  // 模拟点击事件
  it('当用户点击了 click me！，计数器加一', () => {
    const wrapper = shallowMount(AnimateCss,{ store, localVue,router })
    const clickMe = wrapper.find('.count')
    clickMe.trigger('click')
    expect(wrapper.vm.count).toBe(1)
  })
});

describe('vuex使用测试 并mock数据', () => {
  let actions, store;
  // 使用 beforeEach 来确认我们在每项测试之前已经拥有一个干净的 store
  beforeEach(() => {
    actions = {
      actionClick: jest.fn(),
      actionInput: jest.fn(),
      mockCallback: jest.fn(),
    }
    store = new Vuex.Store({
      state: {},
      actions,
      modules
    })
  });

  it('当输入框的值不是“input”但有“input”事件触发时不会掉用“actionInput”的 action', () => {
    const wrapper = shallowMount(AnimateCss, { store, localVue });
    const input = wrapper.find('input');
    input.element.value = 'not input';
    input.trigger('input');
    expect(actions.actionInput).not.toHaveBeenCalled();
  });

  it('mock数据，确保函数被预期调用', ()=>{
    const wrapper = shallowMount(AnimateCss, { store, localVue });
    wrapper.vm.forEach([0,1],actions.mockCallback);
    
    expect(actions.mockCallback.mock.calls.length).toBe(2);
  });

})