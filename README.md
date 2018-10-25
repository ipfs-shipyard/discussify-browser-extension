# @discussify/browser-extension

Discussify's browser extension.

## Development

1. Start the project for development

2. Install the extension manually in Chrome/Firefox

    Go to `chrome://extensions` in Chrome and click "Load Unpacked". Point to the `dist/` folder of this project. The extension should now appear in the extensions list!

    Any changes to the source code will be compiled and the extension should automatically reload, thanks to [webpack-chrome-extension-reloader]( https://github.com/rubenspgcavalcante/webpack-chrome-extension-reloader). If you have any problems with this feature, simply click the reload button on the extension.

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
