export default {
  TableName: 'Invoices',
  Properties: {
    AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 2,
      WriteCapacityUnits: 2,
    },
  },
  Data: [
    {
      id: { S: '123' },
      date: { S: 'some weird string' },
    },
  ],
}
