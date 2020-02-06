const { app, BrowserWindow } = require("electron");
const { macFull } = require("./full-screen");
const panels = require("./panels");
const { appName, version } = require("../../package.json");

const { NODE_ENV } = process.env;

const subMenuAbout = {
  label: appName,
  submenu: [
    {
      label: `Version ${version}`,
    },
    { type: "separator" },
    {
      label: `Hide ${appName}`,
      accelerator: "Command+H",
      selector: "hide:",
    },
    {
      label: "Hide Others",
      accelerator: "Command+Shift+H",
      selector: "hideOtherApplications:",
    },
    { label: "Show All", selector: "unhideAllApplications:" },
    { type: "separator" },
    {
      label: "Quit",
      accelerator: "Command+Q",
      click: app.quit,
    },
  ],
};

const subMenuViewDev = {
  label: "View",
  submenu: [
    {
      label: "Reload",
      accelerator: "Command+R",
      click: () => {
        const win = BrowserWindow.getFocusedWindow();
        win.webContents.reload();
      },
    },
    macFull,
    {
      label: "Toggle Developer Tools",
      accelerator: "Alt+Command+I",
      click: () => {
        const win = BrowserWindow.getFocusedWindow();
        win.toggleDevTools();
      },
    },
  ],
};

const subMenuViewProd = {
  label: "View",
  submenu: [macFull],
};

const subMenuWindow = {
  label: "Window",
  submenu: [
    {
      label: "Minimize",
      accelerator: "Command+M",
      selector: "performMiniaturize:",
    },
    { label: "Close", accelerator: "Command+W", selector: "performClose:" },
    { type: "separator" },
    { label: "Bring All to Front", selector: "arrangeInFront:" },
  ],
};

const subMenuView = NODE_ENV === "development" ? subMenuViewDev : subMenuViewProd;

module.exports = [subMenuAbout, subMenuView, ...panels, subMenuWindow];
