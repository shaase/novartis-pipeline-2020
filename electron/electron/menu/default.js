const { app, BrowserWindow } = require("electron");
const { appName, version } = require("../../package.json");
const panels = require("./panels");
const { winFull } = require("./full-screen");

const templateDefault = [
  {
    label: appName,
    submenu: [
      {
        label: `Version ${version}`,
      },
      { type: "separator" },
      {
        label: "&Open",
        accelerator: "Ctrl+O",
      },
      {
        label: "&Close",
        accelerator: "Ctrl+W",
        click: app.quit,
      },
    ],
  },
  {
    label: "&View",
    submenu:
      process.env.NODE_ENV === "development"
        ? [
            {
              label: "&Reload",
              accelerator: "Ctrl+R",
              click: () => {
                const win = BrowserWindow.getFocusedWindow();
                win.webContents.reload();
              },
            },
            winFull,
            {
              label: "Toggle &Developer Tools",
              accelerator: "Alt+Ctrl+I",
              click: () => {
                const win = BrowserWindow.getFocusedWindow();
                win.toggleDevTools();
              },
            },
          ]
        : [winFull],
  },
];

module.exports = [...templateDefault, ...panels];
