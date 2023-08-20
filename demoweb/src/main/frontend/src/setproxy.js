// src/main/frontend/src/setProxy.js

import { createProxyMiddleware } from "http-proxy-middleware";

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:8080", // 서버 URL or localhost:설정한포트번호 인스턴스: 43.201.239.13
      changeOrigin: true,
    })
  );
};
