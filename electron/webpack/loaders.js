const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const { NODE_ENV } = process.env;
const isDev = NODE_ENV === "development";

module.exports = [
  {
    test: /\.(ts|tsx|js|jsx)$/,
    exclude: /node_modules/,
    use: ["babel-loader"],
  },
  {
    test: /\.css$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: "./",
          hmr: isDev,
          reloadAll: true,
        },
      },
      {
        loader: "css-loader",
        options: {
          sourceMap: true,
        },
      },
    ],
  },
  {
    test: /\.module\.s(a|c)ss$/,
    loader: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          hmr: isDev,
          reloadAll: true,
        },
      },
      {
        loader: "css-loader",
        options: {
          modules: {
            localIdentName: "[path][name]__[local]--[hash:base64:5]",
          },
          sourceMap: isDev,
        },
      },
      {
        loader: "sass-loader",
        options: {
          sourceMap: isDev,
        },
      },
    ],
  },
  {
    test: /\.(png|svg|jpg|gif)$/,
    use: ["file-loader"],
  },
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    use: ["file-loader"],
  },
  {
    test: /\.(mp4|mov|mp3)$/,
    use: ["file-loader"],
  },
];
