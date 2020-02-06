const { app } = require("electron");
const { initPersistent } = require("radius-electron");
const ElectronWindow = require("./window");
const ElectronMenu = require("./menu");

let mainWindow;
const { NODE_ENV } = process.env;

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
initPersistent(app.getPath("userData"));

const installExtensions = async () => {
  const installer = require("electron-devtools-installer");
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ["REACT_DEVELOPER_TOOLS"];

  return Promise.all(extensions.map(name => installer.default(installer[name], forceDownload))).catch(console.log);
};

const createWindow = () => {
  mainWindow = ElectronWindow();

  const menu = new ElectronMenu(mainWindow);
  menu.build();
};

app.on("ready", () => {
  if (NODE_ENV === "development") {
    installExtensions()
      .then(() => {
        createWindow();
        return true;
      })
      .catch(error => console.log("An error occurred:", error));
  } else {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  app.quit();
});
