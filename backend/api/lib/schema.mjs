import express from 'express'
import cors from 'cors'
import graphqlHTTP from 'express-graphql'

import { readTextFile } from 'lib/local-file'
import { get, add } from 'lib/timesheet-entry'
import buildSchema from './build-schema'

export default async () => {
  const port = process.env.PORT || 3000
  const server = express()

  const schema = buildSchema(await readTextFile('./templates/schema.graphql'))

  const rootValue = {
    timesheetEntry: get,
    addTimesheetEntry: add,
  }

  server.use(cors())

  server.get(
    '/graphql',
    graphqlHTTP({
      schema,
      rootValue,
      graphiql: true,
    }),
  )

  server.post(
    '/graphql',
    graphqlHTTP({
      schema,
      rootValue,
      graphiql: false,
    }),
  )

  server.listen(port, () => {
    console.log(`graphql server listening on port: ${port}`)
  })
}
