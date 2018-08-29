import AWSAppSyncClient from 'aws-appsync';
import config from './config';

export default new AWSAppSyncClient({
  url: config.endpoints.local,
  region: config.region,
  auth: { type: 'API_KEY', apiKey: config.auth.apiKey }
})
