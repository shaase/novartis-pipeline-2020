const { app } = require("electron");
const { setPersistent } = require("radius-electron");
const { panel: panelStore } = require("../../store.json");

let arrPanel = [];

if (panelStore !== undefined) {
  const { key: PANEL_KEY, values: panels } = panelStore;
  const label = "Panels";

  const submenu = panels.map(panel => ({
    label: panel,
    click: () => {
      setPersistent(PANEL_KEY, panel);
      app.relaunch();
      app.exit(0);
    },
  }));

  arrPanel = panels.length > 1 ? [{ label, submenu }] : [];
}

module.exports = arrPanel;
