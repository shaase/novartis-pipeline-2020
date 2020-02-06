const { emptyDirectory, deleteFile } = require("radius-utils");

// *** EXECUTABLE COMMANDS ***
const main = async () => {
  try {
    await emptyDirectory("./dist");
    await emptyDirectory("./release");
    await deleteFile("./node_modules");

    return "completed archive";
  } catch (error) {
    console.log(error);
  }
};

main()
  .then(res => console.log(res))
  .catch(console.error);
