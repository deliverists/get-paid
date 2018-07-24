import express from 'express'
import graphqlHTTP from 'express-graphql'
import Aws from 'aws-sdk'
import buildSchema from './build-schema'

const initialiseAws = () => {
  Aws.config.update({ region: 'us-east-1' })
}

const initialiseDyanmo = () =>
  new Aws.DynamoDB.DocumentClient({
    endpoint: new Aws.Endpoint('http://localhost:8000'),
  })

export default () => {
  initialiseAws()
  const dynamo = initialiseDyanmo()

  const port = process.env.PORT || 3000
  const server = express()

  const schema = `
  type Invoice {
    id: ID!
    date: String
  }
  type Root {
    invoice(id: ID!): Invoice
  }
  schema {
    query: Root
  }`

  const getInvoice = params =>
    dynamo
      .get({
        Key: {
          id: params.id,
        },
        TableName: 'Invoices',
      })
      .promise()
      .then(data => {
        console.log('in themn', data)
        return data.Item
      })

  const root = {
    invoice: getInvoice,
  }

  server.get(
    '/graphql',
    graphqlHTTP({
      schema: buildSchema(schema),
      rootValue: root,
      graphiql: true,
    }),
  )

  server.post(
    '/graphql',
    graphqlHTTP({
      schema: buildSchema(schema),
      rootValue: root,
      graphiql: false,
    }),
  )

  server.listen(port, () => {
    console.log(`graphql server listening on port: ${port}`)
  })
}
