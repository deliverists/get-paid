import React from 'react';
import AWSAppSyncClient from 'aws-appsync';
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo'
import { render } from "react-dom"
import { BrowserRouter, Route } from 'react-router-dom'

import InvoiceScreen from './components/InvoiceScreen';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const appsyncClient = new AWSAppSyncClient({
  url: 'http://localhost:3000/graphql',
  region: 'us-east-1',
  auth: { type: 'API_KEY', apiKey: 'da2-w5isxtvkdjdhxmb7pfucndiypy' }
});


render((
  <ApolloProvider client={appsyncClient}>
    <Rehydrated>
      <BrowserRouter>
        <Route path='/' component={InvoiceScreen} />
      </BrowserRouter>
    </Rehydrated>
  </ApolloProvider>
  ),
  document.getElementById('root')
)

registerServiceWorker();
