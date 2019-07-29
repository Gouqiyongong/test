//可以引用node环境的包
const url = require('url');
const querystring = require('querystring');

//处理函数
module.exports = (req, res, next) => {
  let parsedUrl = url.parse(req.url);
  let params = querystring.parse(parsedUrl.query);

  if (parsedUrl.pathname == "/echo") { //若请求路径为'/echo'
    res.end(JSON.stringify(params)); //则将入参作为数据，予以返回
  }
  else		//否则，不做处理进入下一步
    next();
}

