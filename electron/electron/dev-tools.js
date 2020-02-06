const { Menu } = require("electron");

const setupDevelopmentEnvironment = window => {
  window.openDevTools();
  window.webContents.on("context-menu", (e, props) => {
    const { x, y } = props;

    Menu.buildFromTemplate([
      {
        label: "Inspect element",
        click: () => {
          window.inspectElement(x, y);
        },
      },
    ]).popup(window);
  });
};

module.exports = setupDevelopmentEnvironment;
