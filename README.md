# @discussify/browser-extension

Discussify's browser extension.

<img src="https://ipfs.io/ipfs/QmP5JNsCy5ccj8bSuPrGF9RB3Yz8vBHxpXMtKCgzeY1BaK" width="80%" alt="Screenshot" />

## Installation

Choose one of the installations below. Note that you will need to have a self-sovereign identity on [uPort](https://www.uport.me/) to sign in into the app.

### Easy install (AMO/Add-ons for Firefox and Chrome Web Store)

#### Chrome Web Store

Download and install it [here](https://chrome.google.com/webstore/detail/discussify/bfmnjjkobeboejeocbompgljbiafbgcc).

#### AMO/Add-ons for Firefox

We did not submit the extension to AMO yet as we are tackling privacy policy first. There is an opened issue for that and you can check its status [here](https://github.com/ipfs-shipyard/pm-discussify/issues/68).

### Build from source

**Warning:** It is recommended that you install from AMO or the Chrome Web Store, since that will give you automatic updates. Building from source, your extension will not update, and you will have to rebuild every time a new version comes out.

1. Clone the project.

1. (optionally) Checkout a specific [version tag](./CHANGELOG.md). By default, `master` is checked out.

1. Install the dependencies by running `npm install` in the project folder.

1. Build the project by running `npm run build` in the project folder.

1. On Chrome:
    1. Type `chrome://extensions` in the URL bar.
    1. Enable "_Developer mode_".
    1. Click on "_Load unpacked extension..._" button.
    1. Point to `dist/chrome`.

1. On Firefox:

    1. Type `about:debugging` in the URL bar.
    1. Click on "_Enable add-on debugging_".
    1. Click on "_Load Temporary Add-on_".
    1. Pick the file `dist/firefox/manifest.json`.

1. The extension should now appear in the extensions list! Click on the extension icon and then look for the white floating action button in the bottom right of your window to login with a uPort identity and start using Discussify.

## Contributing

If you want to contribute for the project, we encourage you to read over the [pm-discussify](https://github.com/ipfs-shipyard/pm-discussify) repository README.

In order to run the project, follow the [Build from source](#build-from-source) instructions but, instead of `npm run build`, use `npm start`.

Any changes to the source code will be compiled and the extension should automatically reload, thanks to [webpack-chrome-extension-reloader](https://github.com/rubenspgcavalcante/webpack-chrome-extension-reloader). If you have any problems with this feature, simply click the reload button on the extension.

### Commands

#### start

You can start your project for development in 3 different ways:

```sh
$ npm run start:chrome
```
```sh
$ npm run start:firefox
```
```sh
$ npm start
```

All the commands listed above start the project for development. Note the differences:

- `$ npm run start:chrome` will produce a development build on `dist/chrome/build`. You should point to `dist/chrome` on `chrome://extensions/`.

- `$ npm run start:firefox` will also produce a development build but this time on `dist/firefox/build`. You should pick the `dist/firefox/manifest.json` file when you are click on "_Load Temporary Add-on_".

- `$ npm start` runs `npm run start:chrome` by default.

#### build

```sh
$ npm run build
```

Builds the project for production.

#### test

```sh
$ npm test
```

Runs the project tests.

#### lint

```sh
$ npm run lint
```

Checks if the project has any linting errors.

## Privacy Policy

We encourage you to read our [Privacy Policy](https://github.com/ipfs-shipyard/pm-discussify/blob/master/PRIVACY_POLICY.md) before start using Discussify.
