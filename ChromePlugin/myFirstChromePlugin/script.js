const canvas = document.createElement("canvas");
$('body').append($(canvas))
setInterval(() => {
  updateList();
}, 1000)
function updateList() {
  let $domList = $('.files.started li.upload');
  if(!$domList.length) {
    return;
  }
  $domList.each((index, li) => {
    let $li = $(li);
    let src = $li.find('a').attr('href')
    if(!src) {
      return;
    }
    if($li.find('button.goup').length) {
      return;
    }
    let button = $('<button class="goup">上传</button>');
    button.bind('click', () => {
      updateImg(src, $li)
    })
    $li.append(button);
  })
}

function updateImg(src, $li) {
  if($li.find('button.copy').length) {
    return;
  }
  let image = new Image();
  image.src = src;
  image.onload = (e) => {
    canvas.width = image.width;
    canvas.height = image.height;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, image.height);
    let bgBase64Data = canvas.toDataURL("image/png");
    ajax(bgBase64Data).then((url) => {
      let realyUrl = randomPrefix() + url;
      let copyButton = $('<button style="margin-left: 20px;" class="copy">一键复制</button>')
      copyButton.bind('click', () => {
        copyText(realyUrl);
      })
      $li.append(copyButton);
      $li.append(`<span style="margin-left: 20px;">${realyUrl}</span>`);
    })
  }
}

function ajax(imgData) {
  let imgstr = imgData.split('base64,')[1]
  return new Promise((resolve) => {
    $.ajax({
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
          resolve(result)
      },
      //请求失败，包含具体的错误信息
      error : function(e){
        console.log('e.status', e.status);
        console.log('e.responseText', e.responseText);
      }
    });
  })
}

function copyText(text) {
  let e = document.createElement("textarea");
  e.style.position = "fixed";
  e.style.top = 0;
  e.style.left = 0;
  e.style.width = "2em";
  e.style.height = "2em";
  e.style.padding = 0;
  e.style.border = "none";
  e.style.outline = "none";
  e.style.boxShadow = "none";
  e.style.background = "transparent";
  e.style.zIndex = 1000;
  e.value = text;
  document.body.appendChild(e);
  e.select();
  try {
    let n = document.execCommand("copy") ? "成功" : "失败";
    let tip = "复制地址" + n;
    toast(tip)
  } catch (e) {
    let errTip = "不能使用这种方法复制内容"
    toast(errTip, true)
  }
  document.body.removeChild(e)
}

function randomPrefix() {
  var prefix = "https://picx.zhuanstatic.com/zhuanzh/";
  var random = Math.ceil(Math.random() * 6);
  return prefix.replace('x', random);
}

function toast(msg, warn) {
  let e = document.createElement("span");
  e.style.position = "fixed";
  e.style.top = '10%';
  e.style.left = '50%';
  e.style.padding = "5px 20px";
  e.style.borderRadius = "5px";
  e.style.backgroundColor = warn ? 'yellow' : 'rgba(0, 0, 0, .6)';
  e.style.transition = 'all .2s';
  e.style.color = '#fff';
  e.innerHTML = msg;
  document.body.appendChild(e);
  setTimeout(() => {
    document.body.removeChild(e);
  }, 1000)
}