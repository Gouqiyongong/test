function changeObjProperty(o) {
  o.siteUrl = "http://www.baidu.com"
  o = new Object() // 在此处对地址进行了修改
  o.siteUrl = "http://www.google.com"
}
let webSite = new Object();
changeObjProperty(webSite);
console.log(webSite.siteUrl) // http://www.google.com  错误
                              // http://www.baidu.com  正确