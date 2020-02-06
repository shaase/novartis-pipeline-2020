const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const config = require("./config");
const port = require("./server-port");
const { appName, version } = require("../package.json");

const compiler = webpack(config);

const server = async path =>
  new Promise((resolve, reject) => {
    const express = require("express");
    const app = express();

    app.use(
      webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
        noInfo: true
      })
    );

    app.use(require("webpack-hot-middleware")(compiler));

    app.listen(port, () => {
      console.log(`${appName} (${version}) listening on port ${port}!\n`);
      resolve(port);
    });
  });

module.exports = server;
