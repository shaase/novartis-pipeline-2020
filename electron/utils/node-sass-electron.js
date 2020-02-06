const fs = require("fs");
const { copyFile } = require("radius-utils");
const ENV_VERSION = process.env.ENV_VERSION || "darwin-x64-75";
const source = "./utils/binding.node";
const destination = `./node_modules/node-sass/vendor/${ENV_VERSION}/binding.node`;

// *** EXECUTABLE COMMANDS ***
const main = async () => {
  try {
    let fileExists = fs.existsSync(destination);
    if (!fileExists) {
      copyFile(source, destination);
    }

    return "checked node-sass dependencies";
  } catch (error) {
    return `node-sass dependency error: ${error}`;
  }
};

main()
  .then(res => console.log(res))
  .catch(console.error);
