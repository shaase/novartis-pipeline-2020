const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackRootPlugin = require("html-webpack-root-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ErrorsPlugin = require("friendly-errors-webpack-plugin");
// const CopyWebpackPlugin = require("copy-webpack-plugin");
const onErrors = require("./errors");
const { appName: title } = require("../package.json");

const { NODE_ENV } = process.env;
const isDev = NODE_ENV === "development";

const base = [
  new HtmlWebpackPlugin({ title }), // generate html with defined entry points
  new HtmlWebpackRootPlugin(), // adds div with id="root" for react
  new MiniCssExtractPlugin(),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  // new CopyWebpackPlugin([{ from: "./app/images", to: "images" }])
];

const dev = [...base, new ErrorsPlugin({ onErrors })];
const prod = [...base, new CleanWebpackPlugin()];

module.exports = isDev ? dev : prod;
