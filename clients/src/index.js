import React from 'react';
import { render } from "react-dom"
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo';
import api from './api'

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

render((
  <ApolloProvider client={api.client}>
    <Rehydrated>
      <App />
    </Rehydrated>
  </ApolloProvider>
  ),
  document.getElementById('root')
);

registerServiceWorker();
