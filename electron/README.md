# rhl-electron-quick-start

Based on [electron-quick-start](https://github.com/electron/electron-quick-start) (read their
README as well if you're new to Electron), this repo provides a very basic React Hot Loader setup.

Presentation is quite rough around the edges, since there is no styling whatsoever but
it works well. :wink:

## Additions compared to electron-quick-start:

- babel configuration
- webpack configurations for development/production
- webpack-dev-middleware and webpack-hot-middleware in the server-side part of the app
- React dev tools for Electron via [electron-devtools-installer](https://github.com/MarshallOfSound/electron-devtools-installer)
- Example React components to experiment with
- .editorconfig

## To Use

- Download or clone this repository
- Install the dependencies
- Run `yarn start:dev` for development, `yarn start` for production

`HOME=~/.electron-gyp ./node_modules/node-gyp/bin/node-gyp.js rebuild --target=7.1.7 --arch=x64 --dist-url=https://atom.io/download/atom-shell --verbose --libsass_ext= --libsass_cflags= --libsass_ldflags= --libsass_library=`

`NODE_VERSION=darwin-x64-75 ELECTRON_VERSION=7.1.7 node utils/rebuild-node-sass.js`
