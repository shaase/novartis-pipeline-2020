# EXAMPLE CALL
# ENV_VERSION=darwin-x64-75 ELECTRON_VERSION=7.1.7 sh utils/node-sass-rebuild.sh

echo "Cloning node-sass git repo"
git clone --recursive https://github.com/sass/node-sass.git
cd node-sass

echo "Installing node-sass dependencies"
yarn

echo "Generating native module"
HOME=~/.electron-gyp ./node_modules/node-gyp/bin/node-gyp.js rebuild --target=$ELECTRON_VERSION --arch=x64 --dist-url=https://atom.io/download/atom-shell --verbose --libsass_ext= --libsass_cflags= --libsass_ldflags= --libsass_library=
cd ../

echo "Copying native module to node_modules/node-sass"
mkdir -p node_modules/node-sass/vendor/$ENV_VERSION
cp node-sass/build/Release/binding.node node_modules/node-sass/vendor/$ENV_VERSION/binding.node

echo "Deleting node-sass directory"
rm -rf node-sass

echo "Finishing node-sass rebuilding"
echo "Try webpack development server again"