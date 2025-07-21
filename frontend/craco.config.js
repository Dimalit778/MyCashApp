const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      if (env === "production") {
        webpackConfig.devtool = "hidden-source-map";
      } else {
        webpackConfig.devtool = "eval-source-map";
      }

      return webpackConfig;
    },
  },
};
