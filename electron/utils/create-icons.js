const { copyFile, createDirectory, fileExists, renameFile } = require("radius-utils");
const sharp = require("sharp");
const icongen = require("icon-gen");

const pathToPng = process.argv.slice(2)[0];
const sizes = [1024, 512, 256, 128, 96, 64, 48, 32, 24, 16];

const savePng = async size => {
  return new Promise((resolve, reject) => {
    sharp(`${pathToPng}/source.png`)
      .resize(size, size)
      .toFile(`${pathToPng}/icons/${size}.png`, (error, info) => {
        if (error) reject(error);
        resolve(info);
      });
  });
};

const savePngs = async () => {
  return Promise.all(sizes.map(size => savePng(size)));
};

const saveIcons = () => {
  const options = {
    report: false,
    ico: {
      name: "icon",
      sizes: [16, 24, 32, 48, 64, 128, 256],
    },
    icns: {
      name: "icon",
      sizes: [16, 32, 64, 128, 256, 512, 1024],
    },
  };

  return icongen(`${pathToPng}/icons`, `${pathToPng}`, options);
};

const renamePngs = async () => {
  return Promise.all(
    sizes.map(size => renameFile(`${pathToPng}/icons/${size}.png`, `${pathToPng}/icons/${size}x${size}.png`)),
  );
};

// *** EXECUTABLE COMMANDS ***
const main = async () => {
  try {
    await fileExists(pathToPng);
    await createDirectory(`${pathToPng}/icons`);
    await savePngs();
    await saveIcons();
    await copyFile(`${pathToPng}/icons/256.png`, `${pathToPng}/icon.png`);
    await renamePngs();

    return "icons generated";
  } catch (error) {
    return `icon error: ${error}`;
  }
};

main()
  .then(res => console.log(res))
  .catch(console.error);
