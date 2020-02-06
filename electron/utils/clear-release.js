const { emptyDirectory } = require("radius-utils");

(async () => {
  await emptyDirectory("./release");
  console.log("Cleared release directory");
})();
