const { appName } = require("../package.json");

const main = async () => {
  try {
    process.stdout.write(String.fromCharCode(27) + "]0;" + appName + String.fromCharCode(7));
    return true;
  } catch (error) {
    return error;
  }
};

main()
  .then(res => res)
  .catch(console.error);
