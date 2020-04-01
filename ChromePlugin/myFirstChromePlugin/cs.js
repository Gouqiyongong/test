let str = 'data:img/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEXs7Oxc9QatAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg=='
document.getElementById('aa').onclick = async function gotolink(e) {
  e.preventDefault()
  // debugger
  await ajax(str)
  // console.log('aaaaaaaaaaaaa')
  // let a = new Promise(r => {
  //   console.log('bbbbbbbbbbbbbbbb')
  //   r()
  // }).then(() => {
  //   console.log('ccccccccccccccc')
  // })
  // console.log('dddddddddddddddddd')
  // alert('aaa')
  // if(!a) {
  //   e.preventDefault()
  // }
  return
  // e.preventDefault()
  // return false;
}

function ajax(imgData) {
  let imgstr = imgData.split('base64,')[1]
  console.log('aaaaaaaaaaaaaaaaaaaa')
  // debugger
  return new Promise((resolve, reject) => {
    // let timer = setTimeout(() => {
    //   ajax.abort();
    //   toast('上传超时', true);
    //   reject()
    // }, 5000)
    console.log('aacccccccccccccc')
    let ajax = $.ajax({
      //请求方式
      type : "POST",
      //请求的媒体类型
      contentType: "application/json;charset=UTF-8",
      //请求地址
      url : "https://upload.58cdn.com.cn/json",
      //数据，json字符串
      data : JSON.stringify({
        'Pic-Size': '800*0',
        'Pic-IsAddWaterPic': true,
        'Pic-Cut': '0*0*0*0',
        'Pic-Encoding': 'base64',
        'Accept-Encoding': 'gzip,deflate',
        'Pic-Path': '/zhuanzh/',
        'File-Extensions': 'jpg',
        'Pic-Data': imgstr
      }),
      //请求成功
      success : function(result) {
        timer = null;
        resolve(false)
      },
      //请求失败，包含具体的错误信息
      error : function(e){
        resolve(false)
        timer = null;
        console.log('e.status', e.status);
        console.log('e.responseText', e.responseText);
        // toast(e.responseText || '图片上传失败', false)
      }
    });
  })
}