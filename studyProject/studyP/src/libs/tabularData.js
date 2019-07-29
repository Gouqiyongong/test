  /*
    * 点击列表商品跳详情页时存数据
    * 缓存清理 （ 监听离开详情页清理 ）
    * key定义为listInfo每次列表进入详情页替换
  */
 export default class TabularData {
    constructor() {

    }
    //存数据
    static storeData(key,value){
      try {
        let obj = JSON.stringify(value);
        localStorage.setItem(key,obj);
      } catch (error) {
      }
    }

    //取数据
    static fetchData(key){
      let data = localStorage.getItem(key)
      return data ? JSON.parse(data) : '';
    }

    //清数据
    static clearCache(key){
      localStorage.removeItem(key);
    }

  }
