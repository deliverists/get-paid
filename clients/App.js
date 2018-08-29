import React from "react";
import HybridApp from "./src/App";
import { ApolloProvider } from 'react-apollo';
import { Rehydrated } from 'aws-appsync-react';
import api from './src/api'

export default class NativeApp extends React.Component {
    render() {
      return (
      <ApolloProvider client={api.client}>
        <Rehydrated>
          <HybridApp />
        </Rehydrated>
      </ApolloProvider>
      );
    }
}
