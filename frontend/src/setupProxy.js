const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy for backend API
  // /api/* -> http://localhost:8082/api/*
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8082',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
    })
  );
};
