module.exports = (req, res, next) => {
  if (req.method.toUpperCase() == "POST") //数据仅用于设置返回内容，不希望被post请求修改内置模拟数据库的内容
	req.method = "GET";
  next();
}

