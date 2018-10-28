# @discussify/browser-extension

Discussify's browser extension.

<img src="https://ipfs.io/ipfs/QmP5JNsCy5ccj8bSuPrGF9RB3Yz8vBHxpXMtKCgzeY1BaK" width="80%" alt="Screenshot" />

## Installation

Choose one of the installations below. Note that you will need to have a self-sovereign identity on [uPort](https://www.uport.me/) to sign in into the app.

### Pre-alpha

Because the current version is a pre-alpha, it's not yet available through the regular Chrome Web store. Follow these steps to install the extension locally:

1. Download the ZIP file from https://ipfs.io/ipfs/QmUZ7S5T7BJ8mvvNWdCCFpyxfne4YufCmSzVpmCC9SrR2M

1. Extract the ZIP file to a folder

1. Go to `chrome://extensions` in Chrome, enable "Developer Mode" and click "Load Unpacked"

1. Point to the folder where you extracted the ZIP contents

The extension should now appear in the extensions list!

### Development

Follow these step to install the extension locally for development:

1. Clone the project

1. Install the dependencies by running `npm install` in the project folder

1. Start the development server by running `npm start` in the project folder

1. Go to `chrome://extensions` in Chrome, enable "Developer Mode" and click "Load Unpacked"

1. Install the extension manually in Chrome/Firefox

1. Point to the `dist` folder of the project folder

The extension should now appear in the extensions list! Any changes to the source code will be compiled and the extension should automatically reload, thanks to [webpack-chrome-extension-reloader]( https://github.com/rubenspgcavalcante/webpack-chrome-extension-reloader). If you have any problems with this feature, simply click the reload button on the extension.

## Commands

### start

```sh
$ npm start
```

Starts the project for development.

If this is your first time running the project, please go to `chrome://extensions` in Chrome. Click the "Load Unpacked" button and point to the `dist/` folder of this project. The extension should now appear in the extensions list!

Any changes to the source code will be compiled and the extension should automatically reload, thanks to [webpack-chrome-extension-reloader]( https://github.com/rubenspgcavalcante/webpack-chrome-extension-reloader). If you have any problems with this feature, simply click the reload button on the extension.

### build

```sh
$ npm run build
```

Builds the project for production.

You may preview the built site by using any regular static web-server, such as [`serve`](https://github.com/zeit/serve) with `$ serve -s build`.

### test

```sh
$ npm test
```

Runs the project tests.

### lint

```sh
$ npm run lint
```

Checks if the project has any linting errors.

## Contributing

If you want to contribute for the project, we encourage you to read over the [discussify](https://github.com/ipfs-shipyard/discussify) repository README.
