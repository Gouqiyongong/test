import Vue from 'vue'

declare module "vue/types/vue" {
  interface Element {
    [propName: string]: any;
  }
  interface Vue {
    readonly $refs: { [key: string]: Vue | Element | Vue[] | Element[]};
    [propName: string]: any;
  }
}

declare module "*.vue" {
  import Vue from "vue"
  export default Vue
}
