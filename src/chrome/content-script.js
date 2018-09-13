import renderApp from '../app';

const rootEl = document.createElement('div');

rootEl.setAttribute('id', 'discussify-app');

console.log(rootEl);
document.body.appendChild(rootEl);

renderApp(rootEl);
