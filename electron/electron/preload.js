const { remote, ipcRenderer } = require("electron");
const { initPersistent } = require("radius-electron");
const { sockets, metrics } = require("../store");
const { startServer } = require("./socket-server");
const { setMetrics } = require("./metrics");

// PERSISTENT STORE PATH
window.storeDataPath = remote.app.getPath("userData");
initPersistent(window.storeDataPath);

// RESIZE EVENT LHANDLER
ipcRenderer.on("RESIZE", () => {
  document.dispatchEvent(new CustomEvent("RESIZE"));
});

// STARTING WEBSOCKETS SERVER
if (sockets !== undefined) {
  const { port } = sockets;
  startServer(port, ip => {
    window.wsServerIP = `${ip}:${port}`;
  });
}

// SETTING UP METRICS
if (metrics !== undefined) {
  setMetrics();
}
