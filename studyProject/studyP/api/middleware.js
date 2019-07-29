var fs = require('fs');
var path = require('path');

var files = scanDir(path.join(__dirname, "./middlewares")); //获取文件列表
var funcs = files.map((file) => require(file));

module.exports = (req, res, next) => {
  let i = -1;
  nextFunc();

  function nextFunc() {
    ++i;
    if (typeof funcs[i] == "function")
      funcs[i](req, res, nextFunc);
    else
      next();
  }
}

/**
 * 遍历文件夹
 * @param dir
 * @returns {Array}
 */
function scanDir(dir) {
  var files = [];
  scan(dir);
  function scan(_dir) {
    if (fs.statSync(_dir).isFile() && _dir.indexOf('.DS_Store') < 0) {
      return files.push(_dir)
    }
    fs.statSync(_dir).isDirectory() &&
      fs.readdirSync(_dir).forEach((file) => {
        scan(_dir + '/' + file)
      })
  }
  return files
}