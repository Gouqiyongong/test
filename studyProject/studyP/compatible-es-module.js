module.exports = function(content) {
  return content.replace(new RegExp(/require\(['|"].*\/[@a-zA-Z0-9\-_]+(\.(?=(vue|ts)))?\w+['|"]\)(\.default)?/,'g'),function(res) {
    if(/\/libs\//.test(res) || /@(?![\/|components])/.test(res)){
      return res
    }
    return /(\.default)$/.test(res) ? res : res + '.default';
  });
};