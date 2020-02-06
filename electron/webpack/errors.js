const { app } = require("electron");
const clear = require("clear");
const { devDependencies } = require("../package.json");

const { NODE_ENV } = process.env;
const isDev = NODE_ENV === "development";
const { electron: eVersion } = devDependencies;

const onErrors = (_, errors) => {
  setTimeout(() => {
    const error = errors[0]["message"];

    if (isDev && error.includes("Node Sass does not")) {
      app.quit();
      clear();

      let vm = process.versions.modules;
      let ENV = `ENV_VERSION=darwin-x64-${vm}`;
      let ELV = `ELECTRON_VERSION=${eVersion.replace("^", "")}`;

      console.log("Missing node-sass native module for webpack dev server");
      console.log("Copy the embedded module to node_modules");
      console.log(`${ENV} node ./utils/node-sass-electron.js`);

      console.log("Or rebuild node-sass from scratch");
      console.log("Please run the following shell script:");
      console.log(`${ENV} ${ELV} sh utils/node-sass.sh-rebuild`);
      console.log(" ");
    } else {
      console.log("Webpack error", error);
    }
  }, 1000);
};

module.exports = onErrors;
