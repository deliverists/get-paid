import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { createStackNavigator } from 'react-navigation';
import AWSAppSyncClient from 'aws-appsync';
import { Rehydrated } from 'aws-appsync-react';

import { navigatorConfig } from './lib/screens';
import appsyncConfig from './lib/AppSync';

const appsyncClient = new AWSAppSyncClient({
  url: appsyncConfig.graphqlEndpoint,
  region: appsyncConfig.region,
  auth: { type: appsyncConfig.authenticationType, apiKey: appsyncConfig.apiKey }
});

export default () => {
  const Navigator = createStackNavigator(navigatorConfig);

  return (
  <ApolloProvider client={appsyncClient}>
    <Rehydrated>
      <Navigator/>
    </Rehydrated>
  </ApolloProvider>
  );
}
