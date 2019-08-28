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
    let bgBase64Data = canvas.toDataURL("image/png", 0.5);
    // if(getBase64ImgSzie(bgBase64Data) > 200) {
    //   toast('图片不能大于200k', warn)
    //   return
    // }
    // return
    ajax(bgBase64Data).then((url) => {
      let realyUrl = randomPrefix() + url;
      let copyButton = $('<button style="margin-left: 20px;" class="copy">一键复制</button>')
      copyButton.bind('click', () => {
        copyText(realyUrl);
      })
      $li.append(copyButton);
      $li.append(`<span style="margin-left: 20px;">${realyUrl}</span>`);
      toast('图片上传成功')
    })
  }
}

function ajax(imgData) {
  let imgstr = imgData.split('base64,')[1]
  return new Promise((resolve, reject) => {
    let timer = setTimeout(() => {
      ajax.abort();
      toast('上传超时', true);
      reject()
    }, 5000)
    let ajax = $.ajax({
      //请求方式
      type : "POST",
      //请求的媒体类型
      contentType: "application/json;charset=UTF-8",
      //请求地址
      url : "",
      //数据，json字符串
      data :'',
      //请求成功
      success : function(result) {
        timer = null;
        resolve(result)
      },
      //请求失败，包含具体的错误信息
      error : function(e){
        timer = null;
        console.log('e.status', e.status);
        console.log('e.responseText', e.responseText);
        toast(e.responseText || '图片上传失败', false)
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

function toast(msg, warn = false) {
  let e = document.createElement("span");
  e.style.position = "fixed";
  e.style.top = '10%';
  e.style.left = '50%';
  e.style.padding = "5px 20px";
  e.style.borderRadius = "5px";
  e.style.backgroundColor = warn ? 'rgba(255,69,0,.8)' : 'rgba(0, 0, 0, .6)';
  e.style.transition = 'all .2s';
  e.style.color = '#fff';
  e.innerHTML = msg;
  e.style.display = 'none'
  document.body.appendChild(e);
  e.style.display = 'block'
  setTimeout(() => {
    e.style.display = 'none'
    document.body.removeChild(e);
  }, 1000)
}

function getBase64ImgSzie(base64Str) {
  let str = base64Str.split('base64,')[1]
  var equalIndex = str.indexOf('=');
  if(str.indexOf('=')>0) {
      str=str.substring(0, equalIndex);
  }
  var strLength=str.length;
  var fileLength=parseInt(strLength-(strLength/8)*2);
  // 由字节转换为MB
  var size = "";
  size = (fileLength/1024).toFixed(2);
  console.log(size)
  return parseInt(size);
}
