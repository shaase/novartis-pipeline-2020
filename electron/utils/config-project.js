const prompts = require("prompts");
const editJsonFile = require("edit-json-file");

const prompt = async message =>
  await prompts({
    type: "text",
    name: "value",
    message,
  });

(async () => {
  console.log("Configure properties for the project");
  console.log(" ");
  const { value: display } = await prompt("Display name (W2O Radius Electron)");
  const { value: productId } = await prompt("Product id (w2o-radius-electron)");
  const { value: appId } = await prompt("App id (com.w2o-radius.electron)");
  const { value: description } = await prompt("Description");

  console.log(" ");
  console.log("Updating package.json and store.json");

  let pkg = editJsonFile(`${__dirname}/../package.json`);

  pkg.set("appName", display);
  pkg.set("name", productId);
  pkg.set("description", description);

  pkg.set("build.productName", display);
  pkg.set("build.appId", appId);

  pkg.save();

  let str = editJsonFile(`${__dirname}/../store.json`);
  const projKey = display.replace(/ /g, "_");
  const panelKey = `${projKey}_Panel_Key`;
  const metricsKey = `${projKey}_Metrics_Key`;
  const socketsKey = `${projKey}_Sockets_Key`;

  str.set("panel.key", panelKey);
  str.set("metrics.key", metricsKey);
  str.set("sockets.key", socketsKey);

  str.save();

  console.log("Configured package.json and store.json");
})();
