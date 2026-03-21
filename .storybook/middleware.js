const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function expressMiddleware(expressApp) {
  // 配置代理解决跨域问题
  const proxyOptions = {
    target: 'http://dev.ttpark.cn',
    changeOrigin: true,
    secure: false
  };

  expressApp.use('/PublicV2', createProxyMiddleware(proxyOptions));
};