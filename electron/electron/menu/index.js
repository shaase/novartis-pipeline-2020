const { Menu } = require("electron");
const darwin = require("./darwin");
const defaultTemplate = require("./default");

class ElectronMenu {
  mainWindow;

  constructor(mainWindow) {
    this.mainWindow = mainWindow;
  }

  build = () => {
    const template = process.platform === "darwin" ? darwin : defaultTemplate;
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  };
}

module.exports = ElectronMenu;
