import React from 'react';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from 'react-apollo'
import { render } from "react-dom"
import { BrowserRouter, Route } from 'react-router-dom'

import InvoiceScreen from './components/InvoiceScreen';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
});


render((
  <ApolloProvider client={client}>
    <BrowserRouter>
      <Route path='/' component={InvoiceScreen} />
    </BrowserRouter>
  </ApolloProvider>
  ),
  document.getElementById('root')
)

registerServiceWorker();
