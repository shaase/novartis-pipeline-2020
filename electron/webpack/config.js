const path = require("path");
const plugins = require("./plugins");
const loaders = require("./loaders");
const port = require("./server-port");

const { NODE_ENV } = process.env;
const isDev = NODE_ENV === "development";

module.exports = {
  mode: NODE_ENV,
  target: "electron-renderer",
  stats: "errors-only",
  entry: ["webpack-hot-middleware/client", "./app/index.tsx"],
  devtool: "source-map",
  devServer: {
    contentBase: "../dist",
    port,
    hot: isDev,
    stats: "errors-only",
  },
  plugins: [...plugins],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "../dist"),
  },
  module: {
    rules: [...loaders],
  },
  resolve: {
    extensions: ["*", ".ts", ".tsx", ".js", ".jsx", ".scss"],
    alias: {
      "react-dom": "@hot-loader/react-dom",
    },
  },
};
