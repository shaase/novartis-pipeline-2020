const replace = require("replace");
const { gitPush } = require("radius-utils");
const { version } = require("../package.json");

const updatePackageVersion = () => {
  const arr = version.split(".");
  const int = parseInt(arr.pop(), 10);
  arr.push(int + 1);
  const next = arr.join(".");

  const paths = ["./package.json"];
  const replacement = `"version": "${next}"`;
  replace({ regex: `"version": "${version}"`, replacement, paths });
  return next;
};

// *** EXECUTABLE COMMANDS ***
const main = async () => {
  try {
    console.log("bumping version");
    const newVersion = await updatePackageVersion();

    console.log("pushing to github");
    await gitPush("./");
    console.log("pushed");
    return `version updated: ${newVersion}`;
  } catch (error) {
    return `git push error: ${error}`;
  }
};

main()
  .then(res => console.log(res))
  .catch(console.error);
