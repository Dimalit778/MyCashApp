// src/setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  const target = process.env.REACT_APP_ENVIRONMENT === "production"
      ? process.env.REACT_APP_RENDER_SERVER_URL
      : process.env.REACT_APP_API_URL;

  console.log(`Setting up proxy to: ${target}`);

  app.use(
    "/api",
    createProxyMiddleware({
      target,
      changeOrigin: true,
    })
  );
};
