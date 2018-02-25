import React from 'react';

const Html = ({ content, title, store }) => (
  <html>
    <head>
      <meta charSet="UTF-8" />
      <title>{ title }</title>
    </head>
    <body>
      <div id="react-root" dangerouslySetInnerHTML={{ __html: content }} />
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{ __html: `window.REDUX_STATE = ${JSON.stringify(store.getState())};` }}
      />
      <script src="http://localhost:8080/bundle.js" />
    </body>
  </html>
);

export default Html;
