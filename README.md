# @discussify/browser-extension

Discussify's browser extension.

### Create React App

This project was bootstrapped with [create-react-app@1.x.x](https://github.com/facebook/create-react-app) and uses [`react-app-rewire`](https://github.com/timarney/react-app-rewired) to modify configuration without having to eject.

More specifically, the modifications are:

- Added [PostCSS](https://github.com/postcss/postcss) with [MOXY's preset](https://github.com/moxystudio/postcss-preset-moxy)
- Activated CSS modules
- Added [external-svg-sprite-loader](https://github.com/karify/external-svg-sprite-loader) to have SVG sprites

For more information, please read the `create-react-app` documentation.

## Commands

### start

```sh
$ npm start
```

Starts a local web-server for development.

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
