import React from 'react';
import App, { createStoreMiddleware, hydrateStoreMiddleware, createHistoryMiddleware } from './src/App.server';
import Html from './src/Html';
import ReactDOMServer from 'react-dom/server';

const Koa = require('koa');
const app = new Koa();

app.use(createHistoryMiddleware());
app.use(createStoreMiddleware());
app.use(hydrateStoreMiddleware());
app.use(ctx => {
  ctx.body = '<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(
    <Html
      {...ctx}
      content={ReactDOMServer.renderToString(<App {...ctx} />)}
    />
  );
});

app.listen(3000, () => console.log(`Example running at http://127.0.0.1:3000`));
