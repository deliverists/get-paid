import React from 'react';
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo'
import { render } from "react-dom"
import { BrowserRouter, Route } from 'react-router-dom'

import InvoiceScreen from './components/InvoiceScreen';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import api from 'shared/api'

render((
  <ApolloProvider client={api.client}>
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
