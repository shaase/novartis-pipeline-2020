const { spawn } = require("child_process");
const {
  deleteFile,
  createDirectory,
  copyFile,
  copyFiles,
  getExePkgFiles,
  fileTimestamp,
  openBrowser,
  zip,
} = require("radius-utils");
const { appName } = require("../package");
require("dotenv").config();

const asyncForEach = async (arr, callback) => {
  for (const element of arr) {
    await callback(element);
  }
};

const createPathFolders = async (name, path) => {
  let root = "";
  const folders = path.split("/");

  await asyncForEach(folders, async folder => {
    if (folder !== "") {
      root += `/${folder}`;
      await createDirectory(root);
      spawn("open", [path]);
      await copyFile(`./${name}.zip`, `${path}/${name}.zip`);
    }
  });
};

// *** EXECUTABLE COMMANDS ***
const main = async () => {
  try {
    const { DISTRIBUTION_PATHS, BOX_URL } = process.env;
    const distroPaths = DISTRIBUTION_PATHS.split("&&");

    if (distroPaths === undefined || distroPaths === 0 || BOX_URL === undefined) {
      console.log(" ");
      console.log("ERROR: Missing ENV properties");
      console.log(
        "Please create a `.env` file in the root of the `electron` folder. Define DISTRIBUTION_PATHS array with paths where the generated zip file should be saved and BOX_URL for the page to open",
      );
      console.log(" ");
      return false;
    }

    console.log("creating zip for production");
    const name = `${appName.replace(/ /g, "_")}-${fileTimestamp()}`;
    const files = await getExePkgFiles("./release");

    if (files.length === 0) {
      throw "DISTRIBUTION FAILED: NO RELEASE PACKAGES EXIST";
    } else if (files.length === 1) {
      await zip(name, files);
    } else {
      await createDirectory(`./${name}`);
      await copyFiles(files, `./${name}`);

      console.log("zipping");
      await zip(name, `./${name}`);
      await deleteFile(`./${name}`);
    }

    await asyncForEach(distroPaths, async path => {
      await createPathFolders(name, path);
    });

    await deleteFile(`./${name}.zip`);

    openBrowser(BOX_URL);

    return "completed distribution";
  } catch (error) {
    console.log(error);
  }
};

main()
  .then(res => console.log(res))
  .catch(console.error);
