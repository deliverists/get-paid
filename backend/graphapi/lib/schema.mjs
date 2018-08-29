import express from 'express'
import cors from 'cors'
import graphqlHTTP from 'express-graphql'
import Aws from 'aws-sdk'
import buildSchema from './build-schema'
import { readTextFile } from '../../../infrastructure/lib/file/read-local-file'

const initialiseAws = () => {
  Aws.config.update({ region: 'us-east-1' })
}

const initialiseDyanmo = () =>
  new Aws.DynamoDB.DocumentClient({
    endpoint: new Aws.Endpoint('http://localhost:8000'),
  })

export default async () => {
  initialiseAws()
  const dynamo = initialiseDyanmo()

  const port = process.env.PORT || 3000
  const server = express()

  const schema = await readTextFile('../graphapi/graphql-schema.sdl')

  const getInvoice = params =>
    dynamo
      .get({
        Key: {
          id: params.id,
        },
        TableName: 'Invoices',
      })
      .promise()
      .then(data => data.Item)

  const root = {
    invoice: getInvoice,
  }

  server.use(cors())

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
