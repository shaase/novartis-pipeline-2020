const { BrowserWindow } = require("electron");

const toggleFullscreen = () => {
  const win = BrowserWindow.getFocusedWindow();
  const nextState = !win.isFullScreen();
  win.setFullScreen(nextState);
  win.setMenuBarVisibility(!nextState);
};

const macFull = {
  label: "Toggle Full Screen",
  accelerator: "Ctrl+Command+F",
  click: toggleFullscreen
};

const winFull = {
  label: "Toggle &Full Screen",
  accelerator: "F11",
  click: toggleFullscreen
};

module.exports = { macFull, winFull };
