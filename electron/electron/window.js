const path = require("path");
const { BrowserWindow, screen } = require("electron");
const devTools = require("./dev-tools");
const { getPersistent } = require("radius-electron");
const { panel: panelStore } = require("../store");

const { NODE_ENV, DEBUG_PROD } = process.env;
let resizeTimeout;

const widthForHeight = (height, orientation, isFullScreen = false) => {
  const isWin = process.platform === "win32";
  const isLandscape = orientation === "landscape";
  let standard = isWin ? 28 : 20;
  if (isLandscape) {
    standard = isWin ? 50 : 20;
  }

  const mod = isLandscape ? 1.7778 : 0.5625;
  const adj = isFullScreen ? 0 : standard;
  const width = parseInt((height - adj) * mod, 10);
  return width;
};

const openWindow = () => {
  const { key: PANEL_KEY, values: panels, orientations } = panelStore;
  const panel = getPersistent(PANEL_KEY) || panels[0];
  const pi = panels.indexOf(panel);
  const orientation = orientations[pi] || "landscape";
  const display = screen.getPrimaryDisplay();
  const { height: dHeight } = display.size;
  const height = dHeight * 0.8;
  const width = widthForHeight(height, orientation);

  let win = new BrowserWindow({
    show: false,
    resizable: true,
    width,
    height,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (NODE_ENV === "development") {
    const server = require("../webpack/server.js");
    server()
      .then(port => {
        win.loadURL(`http://localhost:${port}/index.html`);
        return true;
      })
      .catch(error => console.log("Development server error occurred:", error));
  } else {
    win.loadFile("dist/index.html");
  }

  win.on("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (win !== undefined && win !== null) {
        const [_, winHeight] = win.getSize(); // eslint-disable-line
        const winWidth = widthForHeight(winHeight, orientation, win.isFullScreen());
        win.setSize(winWidth, winHeight);
        win.webContents.send("RESIZE");
      }
    }, 150);
  });

  win.webContents.on("did-finish-load", () => {
    if (!win) {
      throw new Error('"mainWindow" is not defined');
    }
    win.show();
    win.focus();

    if (NODE_ENV === "development" || DEBUG_PROD === "true") {
      devTools(win);
    }
  });

  win.on("closed", () => {
    win = null;
  });

  return win;
};

module.exports = openWindow;
